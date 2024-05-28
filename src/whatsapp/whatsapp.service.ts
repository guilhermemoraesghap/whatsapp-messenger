import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  ConnectionState,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { ConnectionService } from '../connection/connection.service';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';

@Injectable()
export class WhatsAppService {
  private sessions: Map<string, WASocket> = new Map();

  constructor(
    private readonly connectionService: ConnectionService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private prisma: PrismaService,
  ) {
    this.loadSessions();
  }

  async generateQRCode(
    userId: string,
  ): Promise<{ sessionId: string; qrCode: string }> {
    const userExists = await this.userService.findById(userId);

    if (!userExists.companyId)
      throw new ConflictException('Usuário não tem empresa associada.');

    const sessionId = uuidv4();
    const authPath = `./sessions/${sessionId}`;
    const { state, saveCreds } = await useMultiFileAuthState(authPath);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
    });

    this.sessions.set(sessionId, sock);

    const handleConnectionUpdate = async (update: ConnectionState) => {
      const { qr, connection, lastDisconnect } = update;

      if (qr) {
        qrcode.toDataURL(qr, (err, url) => {
          if (err) {
            console.error('Erro ao gerar QR Code:', err);
          } else {
            return { sessionId, qrCode: url };
          }
        });
      }

      if (connection === 'open') {
        console.log(`Conexão estabelecida para a sessão ${sessionId}`);
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const loggedOut = statusCode === DisconnectReason.loggedOut;

        if (loggedOut) {
          const userExists = await this.userService.findById(userId);

          const users = await this.userService.findByCompanyId(
            userExists.companyId,
          );

          const usersEmails = users.map((user) => user.email);

          const sessionPath = `./sessions/${sessionId}`;

          fs.rmdirSync(sessionPath, { recursive: true });

          this.sessions.delete(sessionId);

          await this.prisma.connection.delete({
            where: {
              sessionId: sessionId,
            },
          });

          await this.emailService.sendEmail({
            subject: 'Dispositivo whatsapp desconectado.',
            text: 'Dispositivo whatsapp desconectado, por favor reconecte o dispositivo ao whatsapp para voltar a enviar mensagens.',
            to: usersEmails,
            html: `
            Dispositivo whatsapp desconectado, por favor reconecte o dispositivo ao whatsapp para voltar a enviar mensagens.</b>
            <br/><br/>
            <b>Não responda este-email</b>
        `,
          });

          return;
        }

        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          try {
            const { state: newState, saveCreds: newSaveCreds } =
              await useMultiFileAuthState(authPath);

            const newSock = makeWASocket({
              auth: newState,
              printQRInTerminal: false,
            });

            this.sessions.set(sessionId, newSock);

            newSock.ev.on('creds.update', newSaveCreds);

            const phoneNumber = newSock.user.id.split(':')[0];

            await this.connectionService.createOrUpdate({
              phoneNumber,
              sessionId,
              userId,
            });

            newSock.ev.on('connection.update', handleConnectionUpdate);
          } catch (err) {
            const sessionPath = `./sessions/${sessionId}`;
            if (sessionPath) {
              fs.rmdirSync(sessionPath, { recursive: true });
            }
            this.sessions.delete(sessionId);
            console.error('Erro ao tentar reconectar:', err);
          }
        }
      }
    };

    sock.ev.on('connection.update', handleConnectionUpdate);
    sock.ev.on('creds.update', saveCreds);

    return new Promise<{ sessionId: string; qrCode: string }>(
      (resolve, reject) => {
        sock.ev.on('connection.update', (update: ConnectionState) => {
          const { qr } = update;
          if (qr) {
            qrcode.toDataURL(qr, (err, url) => {
              if (err) {
                reject(err);
              } else {
                resolve({ sessionId, qrCode: url });
              }
            });
          }
        });
      },
    ).catch((error) => {
      sock.ws.close();
      const sessionPath = `./sessions/${sessionId}`;
      if (sessionPath) {
        fs.rmdirSync(sessionPath, { recursive: true });
      }
      this.sessions.delete(sessionId);
      throw error;
    });
  }

  async sendMessage({
    companyId,
    message,
    patientId,
    patientName,
    phoneNumber,
  }: SendMessageDto): Promise<string> {
    try {
      const companyExists = await this.prisma.company.findUnique({
        where: {
          id: companyId,
        },
      });

      if (!companyExists)
        throw new NotFoundException('Empresa não encontrada.');

      const connectionExists =
        await this.connectionService.findByCompanyId(companyId);

      if (!connectionExists)
        throw new NotFoundException('Essa empresa não possui uma conexão.');

      const sock = this.sessions.get(connectionExists.sessionId);

      if (!sock) {
        throw new NotFoundException(
          `Sessão com ID ${connectionExists.sessionId} para a empresa ${companyExists.name} não encontrada`,
        );
      }

      const formattedNumber = `${phoneNumber}@s.whatsapp.net`;

      await sock.sendMessage(formattedNumber, { text: message });

      console.log(`Mensagem enviada para ${formattedNumber}`);

      return `Mensagem enviada com sucesso para ${phoneNumber} usando o dispositivo ${connectionExists.sessionId}!`;
    } catch (error) {
      await this.prisma.whatsappMessageLog.create({
        data: {
          message,
          phoneNumber,
          patientId,
          patientName,
          companyId,
        },
      });

      throw error;
    }
  }

  async resendMessage({ phoneNumber, sessionId, message }) {
    const sock = this.sessions.get(sessionId);

    if (!sock) {
      throw new Error(`Sessão com ID ${sessionId} não encontrada`);
    }

    const formattedNumber = `${phoneNumber}@s.whatsapp.net`;

    await sock.sendMessage(formattedNumber, { text: message });

    console.log(`Mensagem enviada para ${formattedNumber}`);

    return `Mensagem enviada com sucesso para ${phoneNumber} usando o dispositivo ${sessionId}!`;
  }

  private async loadSessions(): Promise<void> {
    const connections = await this.connectionService.findAll();

    for await (const connectionData of connections) {
      const authPath = `./sessions/${connectionData.sessionId}`;

      if (!fs.existsSync(authPath)) {
        console.log(
          `Diretório não existe para a sessão ${connectionData.sessionId}, pulando conexão.`,
        );
        continue;
      }

      const { state, saveCreds } = await useMultiFileAuthState(authPath);

      const sock = makeWASocket({ auth: state });

      sock.ev.on('creds.update', saveCreds);

      sock.ev.on('connection.update', async (update: ConnectionState) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as Boom)?.output
            ?.statusCode;

          const loggedOut = statusCode === DisconnectReason.loggedOut;

          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          if (loggedOut) {
            const users = await this.userService.findByCompanyId(
              connectionData.companyId,
            );

            const usersEmails = users.map((user) => user.email);

            const sessionPath = `./sessions/${connectionData.sessionId}`;

            fs.rmdirSync(sessionPath, { recursive: true });

            this.sessions.delete(connectionData.sessionId);

            await this.prisma.connection.delete({
              where: {
                sessionId: connectionData.sessionId,
              },
            });

            await this.emailService.sendEmail({
              subject: 'Dispositivo whatsapp desconectado.',
              text: 'Dispositivo whatsapp desconectado, por favor reconecte o dispositivo ao whatsapp para voltar a enviar mensagens.',
              to: usersEmails,
              html: `
              Dispositivo whatsapp desconectado, por favor reconecte o dispositivo ao whatsapp para voltar a enviar mensagens.</b>
              <br/><br/>
              <b>Não responda este-email</b>
          `,
            });

            return;
          }

          if (shouldReconnect) {
            console.log(`Reconectando sessão ${connection}`);

            const newSock = makeWASocket({ auth: state });

            this.sessions.set(connectionData.sessionId, newSock);

            newSock.ev.on('creds.update', saveCreds);
          }
        }
      });

      this.sessions.set(connectionData.sessionId, sock);
    }
  }

  async disconnectDevice(userId: string) {
    const userExists = await this.userService.findById(userId);

    if (!userExists) throw new NotFoundException('Usuário não encontrado.');

    const connection = await this.connectionService.findByCompanyId(
      userExists.companyId,
    );

    if (!connection)
      throw new ConflictException('Empresa não tem uma conexão ativa.');

    const session = this.sessions.get(connection.sessionId);

    await session.logout();

    return `Sessão de id ${connection.sessionId} desconectada.`;
  }
}

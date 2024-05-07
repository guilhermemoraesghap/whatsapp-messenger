import { Injectable, NotFoundException } from '@nestjs/common';
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
import { PrismaService } from '../prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class WhatsAppService {
  private sessions: Map<string, WASocket> = new Map();
  private sock: WASocket;

  constructor(
    private readonly connectionService: ConnectionService,
    private prisma: PrismaService,
  ) {
    this.loadSessions();
  }

  async generateQRCode(
    userId: string,
  ): Promise<{ sessionId: string; qrCode: string }> {
    const sessionId = uuidv4();

    const authPath = `./sessions/${sessionId}`;

    const { state, saveCreds } = await useMultiFileAuthState(authPath);

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
    });

    this.sessions.set(sessionId, this.sock);

    return new Promise<{ sessionId: string; qrCode: string }>(
      (resolve, reject) => {
        this.sock.ev.on(
          'connection.update',
          async (update: ConnectionState) => {
            const { qr, connection, lastDisconnect } = update;

            if (qr) {
              qrcode.toDataURL(qr, (err, url) => {
                if (err) {
                  reject(err);
                } else {
                  resolve({ sessionId, qrCode: url });
                }
              });
            }

            if (connection === 'open') {
              console.log(`Conexão estabelecida para a sessão ${sessionId}`);
            }

            if (connection === 'close') {
              const shouldReconnect =
                (lastDisconnect?.error as Boom)?.output?.statusCode !==
                DisconnectReason.loggedOut;

              if (shouldReconnect) {
                this.sock = makeWASocket({
                  auth: state,
                  printQRInTerminal: false,
                });

                this.sessions.set(sessionId, this.sock);

                const phoneNumber = this.sock.user.id.split(':')[0];

                await this.connectionService.createOrUpdate({
                  phoneNumber,
                  sessionId,
                  userId,
                });
              }
            }
          },
        );

        this.sock.ev.on('creds.update', saveCreds);
      },
    );
  }

  async sendMessage({
    companyId,
    message,
    patientId,
    patientName,
    phoneNumber,
    sessionId,
  }: SendMessageDto): Promise<string> {
    const companyExists = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!companyExists) throw new NotFoundException('Empresa não encontrada.');

    try {
      const sock = this.sessions.get(sessionId);
      if (!sock) {
        throw new Error(`Sessão com ID ${sessionId} não encontrada`);
      }
      const formattedNumber = `${phoneNumber}@s.whatsapp.net`;

      await sock.sendMessage(formattedNumber, { text: message });

      console.log(`Mensagem enviada para ${formattedNumber}`);

      return `Mensagem enviada com sucesso para ${phoneNumber} usando o dispositivo ${sessionId}!`;
    } catch (error) {
      console.log(`Erro ao enviar mensagem através do whatsapp.`);

      await this.prisma.whatsappMessageLog.create({
        data: {
          message,
          phoneNumber,
          patientId,
          patientName,
          companyId,
        },
      });
    }
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
          const shouldReconnect =
            (lastDisconnect?.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;

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
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { ResendMessageDto } from './dto/resend-message.dto';
import { UserService } from '../user/user.service';
import { ConnectionService } from '../connection/connection.service';
import { format } from 'date-fns';
import * as path from 'path';
import * as ejs from 'ejs';
import * as puppeteer from 'puppeteer';
import * as mustache from 'mustache';

@Injectable()
export class WhatsAppMessageLogService {
  constructor(
    private prisma: PrismaService,
    private readonly whatsAppService: WhatsAppService,
    private readonly userService: UserService,
    private readonly connectionService: ConnectionService,
  ) {}

  async findByCompanyId(
    userId: string,
    page: number,
    limit: number,
    isSent?: boolean,
  ) {
    const userExists = await this.userService.findById(userId);

    if (!userExists) throw new ConflictException('Usuário não encontrado.');

    const where: any = { companyId: userExists.companyId };

    if (typeof isSent === 'boolean') {
      where.isSent = isSent;
    }
    const whatsappMessages = await this.prisma.whatsappMessageLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return whatsappMessages;
  }

  private async findNotSendByCompanyId(userId: string) {
    const userExists = await this.userService.findById(userId);

    const whatsappMessages = await this.prisma.whatsappMessageLog.findMany({
      where: {
        isSent: false,
        companyId: userExists.companyId,
      },
    });

    return whatsappMessages;
  }

  async resendMessageToWhatsApp({ userId }: ResendMessageDto) {
    const userExists = await this.userService.findById(userId);

    const connectionExists = await this.connectionService.findByCompanyId(
      userExists.companyId,
    );

    if (!connectionExists)
      throw new NotFoundException('Essa empresa não possui uma conexão.');

    const messagesNotSended = await this.findNotSendByCompanyId(userId);

    for await (const messageNotSended of messagesNotSended) {
      await this.whatsAppService.resendMessage({
        message: messageNotSended.message,
        phoneNumber: messageNotSended.phoneNumber,
        sessionId: connectionExists.sessionId,
      });

      await this.prisma.whatsappMessageLog.update({
        where: {
          id: messageNotSended.id,
        },
        data: {
          isSent: true,
        },
      });
    }
  }

  async getTotalMessagesSent(userId: string) {
    const userExists = await this.userService.findById(userId);

    if (!userExists) throw new ConflictException('Usuário não encontrado.');

    const totalMessagesSent = await this.prisma.whatsappMessageLog.count({
      where: {
        companyId: userExists.companyId,
        isSent: true,
      },
    });

    return { totalMessagesSent };
  }

  async getMessagesSentByMonth(userId: string) {
    const userExists = await this.userService.findById(userId);

    if (!userExists) throw new ConflictException('Usuário não encontrado.');

    const results = await this.prisma.whatsappMessageLog.groupBy({
      by: ['updatedAt', 'companyId'],
      _count: {
        _all: true,
      },
      where: {
        isSent: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });

    const formattedResults = results.reduce(
      (acc, record) => {
        const monthYear = record.updatedAt.toISOString().slice(0, 7);
        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        acc[monthYear] += record._count._all;
        return acc;
      },
      {} as Record<string, number>,
    );

    return formattedResults;
  }

  async generateMessagesLogsReport(
    userId: string,
    cb: (result: Buffer) => void,
  ) {
    const userExists = await this.userService.findById(userId);

    if (!userExists) throw new ConflictException('Usuário não encontrado.');

    const companyExists = await this.prisma.company.findUnique({
      where: { id: userExists.companyId },
    });

    if (!companyExists) throw new ConflictException('Empresa não encontrada.');

    const messages = await this.prisma.whatsappMessageLog.findMany({
      where: { companyId: userExists.companyId, isSent: true },
      orderBy: { updatedAt: 'desc' },
    });

    const formattedMessages = messages.map((msg) => ({
      phoneNumber: msg.phoneNumber,
      message: msg.message,
      sentAt: format(msg.updatedAt, 'dd/MM/yyyy HH:mm'),
    }));

    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'templates',
      'whatsapp-messages-log.ejs',
    );

    const template = await ejs.renderFile(templatePath);

    const renderedHtml = mustache.render(template, {
      date: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      messages: formattedMessages,
      user: userExists.username,
      company: companyExists.name,
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    try {
      const page = await browser.newPage();

      await page.setContent(renderedHtml);

      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

      cb(Buffer.from(pdfBuffer));
    } finally {
      await browser.close();
    }
  }
}

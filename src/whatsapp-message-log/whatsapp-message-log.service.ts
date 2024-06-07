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
}

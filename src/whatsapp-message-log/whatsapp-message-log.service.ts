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

  async findByCompanyId(userId: string) {
    const userExists = await this.userService.findById(userId);

    if (!userExists) throw new ConflictException('Usuário não encontrado.');

    const whatsappMessages = await this.prisma.whatsappMessageLog.findMany({
      where: {
        companyId: userExists.companyId,
      },
    });

    return whatsappMessages;
  }

  async resendMessageToWhatsApp({ id, userId }: ResendMessageDto) {
    const whatssAppMessageLogExists =
      await this.prisma.whatsappMessageLog.findUnique({
        where: {
          id,
        },
      });

    if (!whatssAppMessageLogExists)
      throw new NotFoundException('Mensagem de whatsapp não encontrada.');

    if (whatssAppMessageLogExists.reSend)
      throw new ConflictException('Mensagem já reenviada.');

    const userExists = await this.userService.findById(userId);

    if (!userExists) throw new ConflictException('Usuário não encontrado.');

    if (userExists.companyId !== whatssAppMessageLogExists.companyId)
      throw new ConflictException(
        'Não é possível reenviar mensagem de outra empresa.',
      );

    const connectionExists = await this.connectionService.findByCompanyId(
      userExists.companyId,
    );

    if (!connectionExists)
      throw new NotFoundException('Essa empresa não possui uma conexão.');

    await this.whatsAppService.resendMessage({
      message: whatssAppMessageLogExists.message,
      phoneNumber: whatssAppMessageLogExists.phoneNumber,
      sessionId: connectionExists.sessionId,
    });

    await this.prisma.whatsappMessageLog.update({
      where: {
        id,
      },
      data: {
        reSend: true,
      },
    });

    return `Mensagem enviada com sucesso para ${whatssAppMessageLogExists.phoneNumber} usando o dispositivo ${connectionExists.sessionId}!`;
  }
}

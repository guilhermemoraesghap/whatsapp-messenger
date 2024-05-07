import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { ResendMessageDto } from './dto/resend-messate.dto';

@Injectable()
export class WhatsAppMessageLogService {
  constructor(
    private prisma: PrismaService,
    private readonly whatsAppService: WhatsAppService,
  ) {}

  async findByCompanyId(companyId: string) {
    const whatsappMessages = await this.prisma.whatsappMessageLog.findMany({
      where: {
        companyId,
      },
    });

    return whatsappMessages;
  }

  async resendMessageToWhatsApp({ id, sessionId }: ResendMessageDto) {
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

    await this.whatsAppService.resendMessage({
      message: whatssAppMessageLogExists.message,
      phoneNumber: whatssAppMessageLogExists.phoneNumber,
      sessionId,
    });

    await this.prisma.whatsappMessageLog.update({
      where: {
        id,
      },
      data: {
        reSend: true,
      },
    });

    return `Mensagem enviada com sucesso para ${whatssAppMessageLogExists.phoneNumber} usando o dispositivo ${sessionId}!`;
  }
}

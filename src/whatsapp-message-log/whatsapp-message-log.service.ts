import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

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
}

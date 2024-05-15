import { Module } from '@nestjs/common';
import { WhatsAppMessageLogService } from './whatsapp-message-log.service';
import { PrismaService } from '../prisma.service';
import { WhatsAppMessageLogController } from './whatsapp-message-log.controller';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [WhatsAppModule],
  providers: [WhatsAppMessageLogService, PrismaService],
  controllers: [WhatsAppMessageLogController],
})
export class WhatsAppMessageLogModule {}

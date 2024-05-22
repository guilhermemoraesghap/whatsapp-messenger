import { Module } from '@nestjs/common';
import { WhatsAppMessageLogService } from './whatsapp-message-log.service';
import { PrismaService } from '../prisma.service';
import { WhatsAppMessageLogController } from './whatsapp-message-log.controller';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { ConnectionService } from '../connection/connection.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [WhatsAppModule],
  providers: [
    WhatsAppMessageLogService,
    PrismaService,
    ConnectionService,
    UserService,
    EmailService,
  ],
  controllers: [WhatsAppMessageLogController],
})
export class WhatsAppMessageLogModule {}

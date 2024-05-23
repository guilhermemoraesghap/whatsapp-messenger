import { Module } from '@nestjs/common';
import { WhatsAppMessageLogService } from './whatsapp-message-log.service';
import { WhatsAppMessageLogController } from './whatsapp-message-log.controller';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { ConnectionService } from '../connection/connection.service';
import { UserService } from '../user/user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [WhatsAppModule, PrismaModule, EmailModule, CompanyModule],
  providers: [WhatsAppMessageLogService, ConnectionService, UserService],
  controllers: [WhatsAppMessageLogController],
})
export class WhatsAppMessageLogModule {}

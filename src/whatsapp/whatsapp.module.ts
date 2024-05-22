import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { PrismaService } from '../prisma.service';
import { ConnectionService } from '../connection/connection.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

@Module({
  providers: [
    WhatsAppService,
    PrismaService,
    ConnectionService,
    UserService,
    EmailService,
  ],
  controllers: [WhatsAppController],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}

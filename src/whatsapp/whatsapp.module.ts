import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { ConnectionService } from '../connection/connection.service';
import { UserService } from '../user/user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [PrismaModule, EmailModule, CompanyModule],
  providers: [WhatsAppService, ConnectionService, UserService],
  controllers: [WhatsAppController],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}

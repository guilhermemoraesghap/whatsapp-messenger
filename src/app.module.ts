import { Module } from '@nestjs/common';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { ConnectionModule } from './connection/connection.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { WhatsAppMessageLogModule } from './whatsapp-message-log/whatsapp-message-log.module';
import { EmailModule } from './email/email.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    WhatsAppModule,
    ConnectionModule,
    UserModule,
    AuthModule,
    CompanyModule,
    WhatsAppMessageLogModule,
    EmailModule,
    PrismaModule,
  ],
})
export class AppModule {}

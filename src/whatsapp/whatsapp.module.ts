import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { PrismaService } from '../prisma.service';
import { ConnectionService } from '../connection/connection.service';

@Module({
  providers: [WhatsAppService, PrismaService, ConnectionService],
  controllers: [WhatsAppController],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}

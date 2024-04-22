import { Module } from '@nestjs/common';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { ConnectionModule } from './connection/connection.module';

@Module({
  imports: [WhatsAppModule, ConnectionModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { PrismaService } from '../prisma.service';
import { ConnectionController } from './connection.controller';

@Module({
  providers: [ConnectionService, PrismaService],
  controllers: [ConnectionController],
})
export class ConnectionModule {}

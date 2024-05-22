import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { PrismaService } from '../prisma.service';
import { ConnectionController } from './connection.controller';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

@Module({
  providers: [ConnectionService, PrismaService, UserService, EmailService],
  controllers: [ConnectionController],
})
export class ConnectionModule {}

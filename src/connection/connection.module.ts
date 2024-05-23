import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { UserService } from '../user/user.service';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, EmailModule],
  providers: [ConnectionService, UserService],
  controllers: [ConnectionController],
})
export class ConnectionModule {}

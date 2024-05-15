import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSeed } from './seed/seed';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';

@Module({
  providers: [UserService, UserSeed, PrismaService, EmailService],
  controllers: [UserController],
})
export class UserModule {}

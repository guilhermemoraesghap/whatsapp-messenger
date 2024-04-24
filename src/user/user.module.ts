import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSeed } from './seed/seed';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  providers: [UserService, UserSeed, PrismaService],
  controllers: [UserController],
})
export class UserModule {}

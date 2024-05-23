import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSeed } from './seed/seed';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [PrismaModule, EmailModule, forwardRef(() => CompanyModule)],
  providers: [UserService, UserSeed],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

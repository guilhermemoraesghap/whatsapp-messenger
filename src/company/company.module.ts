import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { UserService } from '../user/user.service';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, EmailModule, UserModule],
  controllers: [CompanyController],
  providers: [CompanyService, UserService],
  exports: [CompanyService],
})
export class CompanyModule {}

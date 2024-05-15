import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, UserService, PrismaService, EmailService],
})
export class CompanyModule {}

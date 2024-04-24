import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/jwt/jwt-guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Res() response: Response,
  ) {
    const companyCreated = await this.companyService.create(createCompanyDto);

    return response.status(HttpStatus.CREATED).json(companyCreated);
  }
}

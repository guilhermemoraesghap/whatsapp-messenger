import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
  Put,
  Param,
  Get,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/jwt/jwt-guard';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthUser, CurrentUser } from 'src/auth/jwt/current-user';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @CurrentUser() user: AuthUser,
    @Body() createCompanyDto: CreateCompanyDto,
    @Res() response: Response,
  ) {
    const companyCreated = await this.companyService.create(
      user.id,
      createCompanyDto,
    );

    return response.status(HttpStatus.CREATED).json(companyCreated);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Res() response: Response,
  ) {
    const companyUpdated = await this.companyService.update(
      id,
      user.id,
      updateCompanyDto,
    );

    return response.status(HttpStatus.OK).json(companyUpdated);
  }

  @Get()
  @UseGuards(JwtGuard)
  async listCompany(@CurrentUser() user: AuthUser) {
    return this.companyService.listCompany(user.id);
  }
}

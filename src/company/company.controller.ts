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
  Patch,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Response } from 'express';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthUser, CurrentUser } from '../auth/jwt/current-user';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('companies')
@Controller('companies')
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
    return await this.companyService.listCompany(user.id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async toggleStatus(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return await this.companyService.toggleStatus(id, user.id);
  }
}

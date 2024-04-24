import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const cnpjAlreadyExists = await this.prisma.company.findUnique({
      where: {
        cnpj: createCompanyDto.cnpj,
      },
    });

    if (cnpjAlreadyExists)
      throw new ConflictException('Este CNPJ já está em uso');

    await this.userService.findById(createCompanyDto.userId);

    const companyCreated = await this.prisma.company.create({
      data: {
        cnpj: createCompanyDto.cnpj,
        name: createCompanyDto.name,
        userId: createCompanyDto.userId,
      },
    });
    return companyCreated;
  }
}

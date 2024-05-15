import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(id: string, createCompanyDto: CreateCompanyDto) {
    const cnpjAlreadyExists = await this.prisma.company.findUnique({
      where: {
        cnpj: createCompanyDto.cnpj,
      },
    });

    if (cnpjAlreadyExists)
      throw new ConflictException('Este CNPJ já está em uso');

    await this.userService.findById(id);

    const companyCreated = await this.prisma.company.create({
      data: {
        cnpj: createCompanyDto.cnpj,
        name: createCompanyDto.name,
        userId: id,
      },
    });
    return companyCreated;
  }

  async update(id: string, userId: string, updateCompanyDto: UpdateCompanyDto) {
    const companyExists = await this.prisma.company.findUnique({
      where: {
        id,
      },
    });

    if (!companyExists) throw new NotFoundException('Empresa não encontrada.');

    if (companyExists.userId !== userId)
      throw new ConflictException(
        'Não é permitido usuário de outra empresa modificar esta empresa.',
      );

    const cnpjAlreadyExists = await this.prisma.company.findUnique({
      where: {
        cnpj: updateCompanyDto.cnpj,
        NOT: {
          id,
        },
      },
    });

    if (cnpjAlreadyExists)
      throw new ConflictException('Este CNPJ já está em uso');

    const companyUpdated = await this.prisma.company.update({
      data: {
        cnpj: updateCompanyDto.cnpj,
        name: updateCompanyDto.name,
      },
      where: {
        id,
      },
    });

    return companyUpdated;
  }

  async listCompany(userId: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        userId,
      },
    });

    return company;
  }
}

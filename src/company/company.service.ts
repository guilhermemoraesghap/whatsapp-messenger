import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const cnpjAlreadyExists = await this.prisma.company.findUnique({
      where: {
        cnpj: createCompanyDto.cnpj,
      },
    });

    if (cnpjAlreadyExists)
      throw new ConflictException('Este CNPJ já está em uso');
    const companyCreated = await this.prisma.company.create({
      data: {
        cnpj: createCompanyDto.cnpj,
        name: createCompanyDto.name,
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

    const userExists = await this.userService.findById(userId);

    if (!userExists) throw new NotFoundException('Usuário não encontrado.');

    if (userExists.companyId !== id)
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
    const userExists = await this.userService.findById(userId);

    if (!userExists) throw new NotFoundException('Usuário não encontrado.');

    if (!userExists.companyId)
      throw new NotFoundException('Usuário ainda não possui empresa.');

    const company = await this.prisma.company.findUnique({
      where: {
        id: userExists.companyId,
      },
    });

    if (!company)
      throw new NotFoundException('Usuário ainda não possui empresa.');

    return company;
  }

  async toggleStatus(id: string, userId: string) {
    const userExists = await this.userService.findById(userId);

    if (!userExists) throw new NotFoundException('Usuário não encontrado.');

    const companyExists = await this.prisma.company.findUnique({
      where: {
        id,
      },
    });

    if (!companyExists) throw new NotFoundException('Empresa não encontrada.');

    console.log(companyExists);
    console.log(userExists);

    if (companyExists.id !== userExists.companyId)
      throw new ConflictException(
        'Não é possível alterar status de uma empresa que esse usuário não pertence.',
      );

    await this.prisma.company.update({
      where: {
        id,
      },
      data: {
        isActive: !companyExists.isActive,
      },
    });
  }

  async findById(id: string) {
    const companyExists = await this.prisma.company.findUnique({
      where: {
        id,
      },
    });

    if (!companyExists) throw new NotFoundException('Empresa não encontrada.');

    return companyExists;
  }
}

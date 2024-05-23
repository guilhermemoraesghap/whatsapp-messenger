import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import * as fs from 'fs';
import { UserService } from '../user/user.service';
@Injectable()
export class ConnectionService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createOrUpdate({
    phoneNumber,
    sessionId,
    userId,
  }: CreateConnectionDto) {
    try {
      const phoneNumerAlreadyExists = await this.prisma.connection.findUnique({
        where: {
          phoneNumber,
        },
      });

      const userExists = await this.userService.findById(userId);

      if (!userExists) throw new NotFoundException('Usuário não encontrado.');

      if (!userExists.companyId)
        throw new ConflictException('Este usuário não tem empresa.');

      if (phoneNumerAlreadyExists) {
        await this.prisma.connection.update({
          data: {
            sessionId,
          },
          where: {
            id: phoneNumerAlreadyExists.id,
          },
        });

        const oldAuthPath = `./sessions/${phoneNumerAlreadyExists.sessionId}`;

        fs.rmdirSync(oldAuthPath, { recursive: true });
      } else {
        await this.prisma.connection.create({
          data: {
            phoneNumber,
            sessionId,
            companyId: userExists.companyId,
          },
        });
      }
    } catch (error) {
      console.error('Erro ao criar ou atualizar conexão:', error);
      throw error;
    }
  }

  async find(userId: string) {
    const userExists = await this.userService.findById(userId);

    if (!userExists) throw new NotFoundException('Usuário não encontrado.');

    const connection = await this.prisma.connection.findUnique({
      where: {
        companyId: userExists.companyId,
      },
    });

    return connection;
  }

  async findAll() {
    const connections = await this.prisma.connection.findMany();

    return connections;
  }

  async findByCompanyId(id: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
      },
    });

    if (!company) throw new NotFoundException('Empresa não encontrada.');

    const connection = await this.prisma.connection.findUnique({
      where: {
        companyId: id,
      },
    });

    return connection;
  }
}

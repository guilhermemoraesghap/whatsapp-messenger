import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConnectionLogDto } from './dto/create-connection-log.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ConnectionLogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}
  async create(createConnectionLogDto: CreateConnectionLogDto) {
    const connectionLogCreated = await this.prisma.connectionLog.create({
      data: {
        action: createConnectionLogDto.action,
        companyId: createConnectionLogDto.companyId,
      },
    });

    return connectionLogCreated;
  }

  async listByCompany(id: string) {
    const userExists = await this.userService.findById(id);

    const connectionsLogs = await this.prisma.connectionLog.findMany({
      where: {
        companyId: userExists.companyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return connectionsLogs;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import * as fs from 'fs';

export interface Connection {
  id: string;
  sessionId: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ConnectionService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate({
    phoneNumber,
    sessionId,
    userId,
  }: CreateConnectionDto) {
    const phoneNumerAlreadyExists = await this.prisma.connection.findUnique({
      where: {
        phoneNumber,
      },
    });

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
          userId,
        },
      });
    }
  }

  async find(userId: string): Promise<Connection> {
    const connection = await this.prisma.connection.findUnique({
      where: {
        userId,
      },
    });

    return connection;
  }

  async findAll(): Promise<Connection[]> {
    const connections = await this.prisma.connection.findMany();

    return connections;
  }
}

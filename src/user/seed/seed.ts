import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UserSeed {
  constructor(private readonly prisma: PrismaService) {}

  async seedAdminUser(): Promise<void> {
    const adminUser = await this.prisma.user.findFirst({
      where: {
        type: 'admin',
      },
    });

    if (!adminUser) {
      const passwordHash = await hash('ghap@#123', 8);

      await this.prisma.user.create({
        data: {
          email: 'devghap@ghap.com.br',
          name: 'master.ghap',
          password: passwordHash,
          type: 'admin',
        },
      });
      console.log('Usuário admin criado com sucesso.');
    }
  }
}

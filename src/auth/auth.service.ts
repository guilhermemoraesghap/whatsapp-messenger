import { compare } from 'bcryptjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create({ password, username }: CreateAuthDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        name: username,
      },
    });

    if (!userExists)
      throw new UnauthorizedException('Usuário ou senha inválidos.');

    const passwordMatch = await compare(password, userExists.password);

    if (!passwordMatch)
      throw new UnauthorizedException('Usuário ou senha inválidos.');

    const payload = {
      sub: userExists.id,
      email: userExists.email,
      type: userExists.type,
    };

    const accessToken = this.jwtService.sign(payload);

    const { name, type } = userExists;

    return {
      access_token: accessToken,
      user: {
        name,
        type,
      },
    };
  }
}

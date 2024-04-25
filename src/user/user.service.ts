import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

export interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const selectFields = {
  createdAt: true,
  email: true,
  id: true,
  name: true,
  password: false,
  type: true,
  updatedAt: true,
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({
    email,
    name,
    password,
  }: CreateUserDto): Promise<CreateUserResponse> {
    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailAlreadyExists)
      throw new ConflictException('Este e-mail já está em uso');

    const passwordHash = await hash(password, 8);

    const userCreated = await this.prisma.user.create({
      data: {
        email,
        name,
        password: passwordHash,
        type: 'user',
      },
    });

    delete userCreated.password;

    return userCreated;
  }

  async findById(id: string) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: selectFields,
    });

    if (!userExists) throw new NotFoundException('Usuário não encontrado.');

    return userExists;
  }

  async update(id: string, { name, email }: UpdateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: selectFields,
    });

    if (!userExists) throw new NotFoundException('Usuário não encontrado.');

    await this.prisma.user.update({
      data: {
        email,
        name,
      },
      where: {
        id,
      },
    });

    const userUpdated = await this.findById(id);

    return userUpdated;
  }
}

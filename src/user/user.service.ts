import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../email/email.service';
import { compare } from 'bcryptjs';
import { CompanyService } from '../company/company.service';
import { AuthUser } from 'src/auth/jwt/current-user';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
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
  username: true,
  password: false,
  type: true,
  isActive: true,
  updatedAt: true,
  companyId: true,
};

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly companyService: CompanyService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    userType: string,
  ): Promise<CreateUserResponse> {
    if (userType !== 'admin') {
      throw new ForbiddenException(
        'Apenas usuários do tipo admin podem criar novos usuários',
      );
    }

    await this.companyService.findById(createUserDto.companyId);

    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (emailAlreadyExists)
      throw new ConflictException('Este e-mail já está em uso');

    const nameAlreadyExists = await this.prisma.user.findUnique({
      where: {
        username: createUserDto.username,
      },
    });

    if (nameAlreadyExists)
      throw new ConflictException('Este nome já está em uso');

    const passwordHash = await hash(createUserDto.password, 8);

    const userCreated = await this.prisma.user.create({
      data: {
        companyId: createUserDto.companyId,
        email: createUserDto.email,
        name: createUserDto.name,
        username: createUserDto.username,
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

  async update(
    authUser: AuthUser,
    { name, email, username, password, confirmPassword }: UpdateUserDto,
  ) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
      select: selectFields,
    });

    if (!userExists) throw new NotFoundException('Usuário não encontrado.');

    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email,
        NOT: {
          id: authUser.id,
        },
      },
    });

    if (emailAlreadyExists)
      throw new ConflictException('Este e-mail já está em uso.');

    const usernameAlreadyExists = await this.prisma.user.findUnique({
      where: {
        username,
        NOT: {
          id: authUser.id,
        },
      },
    });

    if (usernameAlreadyExists)
      throw new ConflictException('Este nome de usuário já está em uso.');

    let passwordHash;

    if (password) {
      if (password !== confirmPassword)
        throw new ConflictException(
          'Senha e confirmar senha devem ser iguais.',
        );

      passwordHash = await hash(password, 8);
    }

    await this.prisma.user.update({
      data: {
        email,
        name,
        username,
        password: passwordHash,
      },
      where: {
        id: authUser.id,
      },
    });

    const userUpdated = await this.findById(authUser.id);

    return userUpdated;
  }

  async adminUpdate(
    authUser: AuthUser,
    {
      name,
      email,
      username,
      password,
      confirmPassword,
      targetUserId,
      companyId,
    }: AdminUpdateUserDto,
  ) {
    if (authUser.type !== 'admin') {
      throw new ConflictException(
        'Somente usuários admin podem atualizar outros usuários.',
      );
    }

    const userExists = await this.prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
      select: selectFields,
    });

    if (!userExists) throw new NotFoundException('Usuário não encontrado.');

    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email,
        NOT: {
          id: targetUserId,
        },
      },
    });

    if (emailAlreadyExists)
      throw new ConflictException('Este e-mail já está em uso.');

    const usernameAlreadyExists = await this.prisma.user.findUnique({
      where: {
        username,
        NOT: {
          id: targetUserId,
        },
      },
    });

    if (usernameAlreadyExists)
      throw new ConflictException('Este nome de usuário já está em uso.');

    if (companyId) {
      await this.companyService.findById(companyId);
    }

    let passwordHash;

    if (password) {
      if (password !== confirmPassword)
        throw new ConflictException(
          'Senha e confirmar senha devem ser iguais.',
        );

      passwordHash = await hash(password, 8);
    }

    await this.prisma.user.update({
      data: {
        companyId,
        email,
        name,
        username,
        password: passwordHash,
      },
      where: {
        id: targetUserId,
      },
    });

    const userUpdated = await this.findById(targetUserId);

    return userUpdated;
  }

  async resetPassword(id: string, username: string) {
    if (id && username)
      throw new ConflictException(
        'Não é possível informar o ID e o usuário juntos.',
      );

    const condition: any = {};

    if (id) {
      condition.id = id;
    } else {
      condition.username = username;
    }

    const userExists = await this.prisma.user.findFirst({
      where: condition,
    });

    if (!userExists) throw new NotFoundException('Usuário não encontrado');

    const passwordGenerated = uuidv4().substring(0, 6);

    const passwordHash = await hash(passwordGenerated, 8);

    await this.prisma.user.update({
      where: {
        id: userExists.id,
      },
      data: {
        password: passwordHash,
      },
    });

    await this.emailService.sendEmail({
      subject: 'Nova senha Whatsapp Messenger',
      text: `Sua nova senha de acesso ao Whatsapp Messenger é ${passwordGenerated}.`,
      to: [userExists.email],
      html: `
      Sua nova senha de acesso ao Whatsapp Messenger é <b>${passwordGenerated}.</b>
      <br/><br/>
      <b>Não responda este-email</b>
  `,
    });
  }

  async changePassword(
    id: string,
    newPassword: string,
    oldPassword: string,
    confirmPassword: string,
  ) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) throw new NotFoundException('Usuário não encontrado');

    const passwordMatch = await compare(oldPassword, userExists.password);

    if (!passwordMatch) throw new ConflictException('Senha antiga inválida.');

    if (oldPassword === newPassword)
      throw new ConflictException(
        'A senha antiga e a nova senha devem ser diferentes.',
      );

    if (newPassword !== confirmPassword)
      throw new ConflictException('Senha e confirmar senha devem ser iguais.');

    const passwordHash = await hash(newPassword, 8);

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: passwordHash,
      },
    });
  }

  async findByCompanyId(id: string) {
    const users = await this.prisma.user.findMany({
      where: {
        companyId: id,
      },
      select: selectFields,
    });

    return users;
  }

  async toggleStatus(id: string, userType: string) {
    if (userType !== 'admin')
      throw new ConflictException(
        'Somente usuários admin poder alterar status de um usuário.',
      );

    const userExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: selectFields,
    });

    if (!userExists) throw new NotFoundException('Usuário não encontrado.');

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: !userExists.isActive,
      },
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: selectFields,
    });

    return users;
  }
}

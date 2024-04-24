import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt/jwt-guard';
import { AuthUser, CurrentUser } from 'src/auth/jwt/current-user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() { email, name, password }: CreateUserDto,
    @Res() response: Response,
  ) {
    const userCreated = await this.userService.create({
      email,
      name,
      password,
    });

    return response.status(HttpStatus.CREATED).json(userCreated);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  findMe(@CurrentUser() user: AuthUser) {
    return this.userService.findById(user.id);
  }

  @Put()
  async update(
    id: string,
    { email, name }: UpdateUserDto,
    @Res() response: Response,
  ) {
    const userUpdated = await this.userService.update(id, {
      email,
      name,
    });

    return response.status(HttpStatus.OK).json(userUpdated);
  }

  @Get()
  async findAll(@Res() response: Response) {
    const users = await this.userService.findAll();

    return response.status(HttpStatus.OK).json(users);
  }
}

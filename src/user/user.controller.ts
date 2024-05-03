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
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { AuthUser, CurrentUser } from '../auth/jwt/current-user';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
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
  async findMe(@CurrentUser() user: AuthUser) {
    return await this.userService.findById(user.id);
  }

  @Put()
  @UseGuards(JwtGuard)
  async update(
    @CurrentUser() user: AuthUser,
    @Body() { email, name }: UpdateUserDto,
    @Res() response: Response,
  ) {
    const userUpdated = await this.userService.update(user.id, {
      email,
      name,
    });

    return response.status(HttpStatus.OK).json(userUpdated);
  }
}

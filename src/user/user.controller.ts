import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
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
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() { companyId, email, name, password }: CreateUserDto,
    @Res() response: Response,
    @CurrentUser() user: AuthUser,
  ) {
    const userCreated = await this.userService.create(
      { companyId, email, name, password },
      user.type,
    );

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

  @Post('reset-password')
  async resetPassword(@Body() { id, user }, @Res() response: Response) {
    await this.userService.resetPassword(id, user);

    return response.status(HttpStatus.OK).json({
      message: 'Sua nova senha foi enviada para o seu e-mail cadastrado.',
    });
  }

  @Put('change-password')
  @UseGuards(JwtGuard)
  async changePassword(
    @CurrentUser() user: AuthUser,
    @Body()
    { newPassword, oldPassword, confirmPassword }: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(
      user.id,
      newPassword,
      oldPassword,
      confirmPassword,
    );
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async toggleStatus(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return await this.userService.toggleStatus(id, user.type);
  }
}

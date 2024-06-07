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
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() { companyId, email, name, username, password }: CreateUserDto,
    @Res() response: Response,
    @CurrentUser() user: AuthUser,
  ) {
    const userCreated = await this.userService.create(
      { companyId, email, name, username, password },
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
    @Body()
    { email, name, username, password, confirmPassword }: UpdateUserDto,
    @Res() response: Response,
  ) {
    const userUpdated = await this.userService.update(user, {
      email,
      name,
      username,
      password,
      confirmPassword,
    });

    return response.status(HttpStatus.OK).json(userUpdated);
  }

  @Put('admin')
  @UseGuards(JwtGuard)
  async adminUpdate(
    @CurrentUser() user: AuthUser,
    @Body()
    {
      email,
      name,
      username,
      password,
      confirmPassword,
      targetUserId,
      companyId,
    }: AdminUpdateUserDto,
    @Res() response: Response,
  ) {
    const userUpdated = await this.userService.adminUpdate(user, {
      email,
      name,
      username,
      password,
      confirmPassword,
      targetUserId,
      companyId,
    });

    return response.status(HttpStatus.OK).json(userUpdated);
  }

  @Post('reset-password')
  async resetPassword(@Body() { id, username }, @Res() response: Response) {
    await this.userService.resetPassword(id, username);

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

  @Get('all')
  @UseGuards(JwtGuard)
  async findAll() {
    return await this.userService.findAll();
  }
}

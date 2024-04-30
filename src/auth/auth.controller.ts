import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() { password, username }: CreateAuthDto,
    @Res() response: Response,
  ) {
    const token = await this.authService.create({ password, username });
    return response.status(HttpStatus.OK).json(token);
  }
}

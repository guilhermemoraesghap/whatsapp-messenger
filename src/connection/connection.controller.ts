import { Controller, Get, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/jwt/jwt-guard';
import { AuthUser, CurrentUser } from 'src/auth/jwt/current-user';

@Controller('connections')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get()
  @UseGuards(JwtGuard)
  async find(@CurrentUser() user: AuthUser, @Res() response: Response) {
    const connections = await this.connectionService.find(user.id);

    return response.status(HttpStatus.OK).json(connections);
  }
}

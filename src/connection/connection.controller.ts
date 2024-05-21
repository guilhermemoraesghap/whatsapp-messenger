import {
  Controller,
  Get,
  Res,
  HttpStatus,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { Response } from 'express';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { AuthUser, CurrentUser } from '../auth/jwt/current-user';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('connections')
@Controller('connections')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get()
  @UseGuards(JwtGuard)
  async find(@CurrentUser() user: AuthUser, @Res() response: Response) {
    const connections = await this.connectionService.find(user.id);

    return response.status(HttpStatus.OK).json(connections);
  }

  @Get('/companies/:id')
  async findByCompanyId(@Param('id') id: string) {
    return await this.connectionService.findByCompanyId(id);
  }
}

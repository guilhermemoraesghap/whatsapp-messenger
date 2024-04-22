import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { Response } from 'express';

@Controller('connections')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get()
  async findAll(@Res() response: Response) {
    const connections = await this.connectionService.findAll();

    return response.status(HttpStatus.OK).json(connections);
  }
}

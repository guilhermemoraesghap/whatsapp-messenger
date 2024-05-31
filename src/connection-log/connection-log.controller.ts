import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConnectionLogService } from './connection-log.service';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { AuthUser, CurrentUser } from '../auth/jwt/current-user';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('connections-logs')
@Controller('connections-logs')
export class ConnectionLogController {
  constructor(private readonly connectionLogService: ConnectionLogService) {}

  @Get()
  @UseGuards(JwtGuard)
  async listByCompany(@CurrentUser() user: AuthUser) {
    return await this.connectionLogService.listByCompany(user.id);
  }
}

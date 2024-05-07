import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { WhatsAppMessageLogService } from './whatsapp-message-log.service';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('whatsapp-message-log')
@Controller('whatsapp-message-log')
export class WhatsAppMessageLogController {
  constructor(
    private readonly whatssAppMessageLogService: WhatsAppMessageLogService,
  ) {}

  @Get(':id')
  @UseGuards(JwtGuard)
  async findByCompanyId(@Param('id') id: string) {
    return await this.whatssAppMessageLogService.findByCompanyId(id);
  }
}

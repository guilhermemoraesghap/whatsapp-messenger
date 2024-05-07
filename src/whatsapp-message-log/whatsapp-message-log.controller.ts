import { Controller, Get, UseGuards, Param, Post, Body } from '@nestjs/common';
import { WhatsAppMessageLogService } from './whatsapp-message-log.service';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { ApiTags } from '@nestjs/swagger';
import { ResendMessageDto } from './dto/resend-message.dto';

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

  @Post('resend-message')
  @UseGuards(JwtGuard)
  async resendMessageToWhatsApp(@Body() { id, sessionId }: ResendMessageDto) {
    return await this.whatssAppMessageLogService.resendMessageToWhatsApp({
      id,
      sessionId,
    });
  }
}

import {
  Controller,
  Get,
  UseGuards,
  Post,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { WhatsAppMessageLogService } from './whatsapp-message-log.service';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser, CurrentUser } from '../auth/jwt/current-user';

@ApiTags('whatsapp-message-log')
@Controller('whatsapp-message-log')
export class WhatsAppMessageLogController {
  constructor(
    private readonly whatssAppMessageLogService: WhatsAppMessageLogService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  async findByCompanyId(
    @CurrentUser() user: AuthUser,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('isSent') isSent?: string,
  ) {
    let isSentBoolean: boolean | undefined;
    if (isSent !== undefined) {
      isSentBoolean = isSent === 'true';
    }
    return await this.whatssAppMessageLogService.findByCompanyId(
      user.id,
      page,
      limit,
      isSentBoolean,
    );
  }

  @Post('resend-message')
  @UseGuards(JwtGuard)
  async resendMessageToWhatsApp(@CurrentUser() user: AuthUser) {
    return await this.whatssAppMessageLogService.resendMessageToWhatsApp({
      userId: user.id,
    });
  }
}

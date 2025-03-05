import {
  Controller,
  Get,
  UseGuards,
  Post,
  Query,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { WhatsAppMessageLogService } from './whatsapp-message-log.service';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser, CurrentUser } from '../auth/jwt/current-user';
import { Response } from 'express';

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

  @Get('sent-messages-count')
  @UseGuards(JwtGuard)
  async getTotalMessagesSent(@CurrentUser() user: AuthUser) {
    return await this.whatssAppMessageLogService.getTotalMessagesSent(user.id);
  }

  @Get('sent-messages-count-month')
  @UseGuards(JwtGuard)
  async getMessagesSentByMonth(@CurrentUser() user: AuthUser) {
    return await this.whatssAppMessageLogService.getMessagesSentByMonth(
      user.id,
    );
  }

  @Get('messages-report')
  @UseGuards(JwtGuard)
  async getWhatsappReport(@CurrentUser() user: AuthUser, @Res() res: Response) {
    await this.whatssAppMessageLogService.generateMessagesLogsReport(
      user.id,
      (result) => {
        return res.end(result);
      },
    );
  }
}

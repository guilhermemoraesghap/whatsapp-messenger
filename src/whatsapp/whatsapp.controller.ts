import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { AuthUser, CurrentUser } from '../auth/jwt/current-user';
import { ApiTags } from '@nestjs/swagger';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('whatsapp')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Get('generate-qr')
  @UseGuards(JwtGuard)
  async generateQRCode(@CurrentUser() user: AuthUser) {
    const qrCode = await this.whatsappService.generateQRCode(user.id);

    return qrCode;
  }

  @Post('send-message')
  async sendMessage(
    @Body()
    {
      companyId,
      message,
      patientId,
      patientName,
      phoneNumber,
      sessionId,
    }: SendMessageDto,
  ): Promise<string> {
    if (!sessionId || !phoneNumber || !message) {
      return 'sessão, número de telefone e mensagem são necessários para enviar uma mensagem.';
    }

    return await this.whatsappService.sendMessage({
      companyId,
      message,
      patientId,
      patientName,
      phoneNumber,
      sessionId,
    });
  }
}

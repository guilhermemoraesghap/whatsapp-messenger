import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { JwtGuard } from 'src/auth/jwt/jwt-guard';
import { AuthUser, CurrentUser } from 'src/auth/jwt/current-user';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Get('generate-qr')
  @UseGuards(JwtGuard)
  async generateQRCode(@CurrentUser() user: AuthUser) {
    const qrCode = await this.whatsappService.generateQRCode(user.id);

    return qrCode;
  }

  @Get('send-message')
  async sendMessage(
    @Query('sessionId') sessionId: string,
    @Query('phoneNumber') phoneNumber: string,
    @Query('message') message: string,
  ): Promise<string> {
    if (!sessionId || !phoneNumber || !message) {
      return 'sessão, número de telefone e mensagem são necessários para enviar uma mensagem.';
    }

    await this.whatsappService.sendMessage(sessionId, phoneNumber, message);

    return `Mensagem enviada com sucesso para ${phoneNumber} usando o dispositivo ${sessionId}!`;
  }
}

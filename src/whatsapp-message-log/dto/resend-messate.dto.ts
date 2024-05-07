export class ResendMessageDto {
  /**
   * ID do log da mensagem do whatsapp.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  id: string;

  /**
   * ID da sessão da conexão do dispotivo.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  sessionId: string;
}

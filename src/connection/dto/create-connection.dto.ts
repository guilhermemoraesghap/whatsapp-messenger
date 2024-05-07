export class CreateConnectionDto {
  /**
   * ID da sessão.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  sessionId: string;

  /**
   * Número de telefone do dispositivo da sessão.
   *
   * @example 553199999999
   */
  phoneNumber: string;

  /**
   * Id do usuário da sessão.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  userId: string;
}

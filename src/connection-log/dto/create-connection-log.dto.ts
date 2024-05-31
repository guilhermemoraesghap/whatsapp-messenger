export class CreateConnectionLogDto {
  /**
   * ID da sessão.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  companyId: string;

  /**
   * Número de telefone do dispositivo da sessão.
   *
   * @example logout | login
   */
  action: string;
}

export class CreateCompanyDto {
  /**
   * Nome da empresa.
   *
   * @example Company Ghost
   */
  name: string;

  /**
   * CNPJ da empresa.
   *
   * @example 12345678000111
   */
  cnpj: string;
}

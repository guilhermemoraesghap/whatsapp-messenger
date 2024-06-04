import { IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto {
  /**
   * Nome da empresa.
   *
   * @example Company Ghost
   */
  @IsNotEmpty({ message: 'Nome obrigatório.' })
  name: string;

  /**
   * CNPJ da empresa.
   *
   * @example 12345678000111
   */
  @IsNotEmpty({ message: 'CNPJ obrigatório.' })
  cnpj: string;
}

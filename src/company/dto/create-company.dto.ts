import { IsString, IsNotEmpty } from 'class-validator';
export class CreateCompanyDto {
  /**
   * Nome da empresa.
   *
   * @example Company Ghost
   */
  @IsString({ message: 'Nome deve ser no formato de texto.' })
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

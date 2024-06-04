import { IsNotEmpty } from 'class-validator';

export class CreateConnectionLogDto {
  /**
   * ID da sessão.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  @IsNotEmpty({ message: 'Id da empresa obrigatório.' })
  companyId: string;

  /**
   * Número de telefone do dispositivo da sessão.
   *
   * @example logout | login
   */
  @IsNotEmpty({ message: 'Ação obrigatória.' })
  action: string;
}

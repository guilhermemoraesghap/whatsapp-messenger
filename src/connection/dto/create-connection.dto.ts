import { IsNotEmpty } from 'class-validator';

export class CreateConnectionDto {
  /**
   * ID da sessão.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  @IsNotEmpty({ message: 'Id da sessão obrigatório.' })
  sessionId: string;

  /**
   * Número de telefone do dispositivo da sessão.
   *
   * @example 553199999999
   */
  @IsNotEmpty({ message: 'Telefone obrigatório.' })
  phoneNumber: string;

  /**
   * Id do usuário da sessão.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  @IsNotEmpty({ message: 'Id do usuário da sessão obrigatório.' })
  userId: string;
}

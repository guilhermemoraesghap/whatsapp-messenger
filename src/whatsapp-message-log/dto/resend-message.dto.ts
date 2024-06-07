import { IsNotEmpty } from 'class-validator';

export class ResendMessageDto {
  /**
   * ID do usuário logado.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  @IsNotEmpty({ message: 'Identificador do usuário obrigatório.' })
  userId: string;
}

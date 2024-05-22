import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  /**
   * Senha antiga.
   *
   * @example 123@#Qwe
   */
  @IsNotEmpty({ message: 'Senha antiga obrigatória.' })
  oldPassword: string;

  /**
   * Nova senha.
   *
   * @example Qwe@#123
   */
  @IsNotEmpty({ message: 'Nova senha obrigatória.' })
  newPassword: string;

  /**
   * Confirmação de nova senha.
   *
   * @example Qwe@#123
   */
  @IsNotEmpty({ message: 'Confirmar senha obrigatório.' })
  confirmPassword: string;
}

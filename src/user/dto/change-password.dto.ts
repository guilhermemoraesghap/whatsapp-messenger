export class ChangePasswordDto {
  /**
   * Senha antiga.
   *
   * @example 123@#Qwe
   */
  oldPassword: string;

  /**
   * Nova senha.
   *
   * @example Qwe@#123
   */
  newPassword: string;

  /**
   * Confirmação de nova senha.
   *
   * @example Qwe@#123
   */
  confirmPassword: string;
}

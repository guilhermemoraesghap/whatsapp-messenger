export class CreateUserDto {
  /**
   * Email do usuário.
   *
   * @example johndoe@example.com
   */
  email: string;

  /**
   * Nome do usuário.
   *
   * @example John Doe
   */
  name: string;

  /**
   * Senha de acesso do usuário.
   *
   * @example Abc@123
   */
  password: string;
}

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

  /**
   * ID da empresa.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  companyId: string;
}

import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  /**
   * Email do usuário.
   *
   * @example johndoe@example.com
   */
  @IsEmail({}, { message: 'Insira um email válido.' })
  email: string;

  /**
   * Nome do usuário.
   *
   * @example John Doe
   */

  @IsString({ message: 'Nome deve ser no formato de texto.' })
  @IsNotEmpty({ message: 'Nome obrigatório.' })
  name: string;

  /**
   * Senha de acesso do usuário.
   *
   * @example Abc@123
   */

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 dígitos.' })
  password: string;

  /**
   * ID da empresa.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */

  @IsNotEmpty({ message: 'Identificador da empresa obrigatório.' })
  companyId: string;
}

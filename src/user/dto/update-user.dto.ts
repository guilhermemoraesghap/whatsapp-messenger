import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  /**
   * Email do usuário.
   *
   * @example johndoe@example.com
   */
  @IsEmail({}, { message: 'Insira um email válido.' })
  @IsOptional()
  email?: string;

  /**
   * Nome do usuário.
   *
   * @example John Doe
   */
  @IsString({ message: 'Nome deve ser no formato de texto.' })
  @IsOptional()
  name?: string;

  /**
   * Nome de usuário.
   *
   * @example johndoe
   */
  @IsString({ message: 'Nome de usuário deve ser no formato de texto.' })
  @IsOptional()
  username?: string;

  /**
   * Senha de acesso do usuário.
   *
   * @example Abc@123
   */

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 dígitos.' })
  @IsOptional()
  password?: string;

  /**
   * Confirmação de senha de acesso do usuário.
   *
   * @example Abc@123
   */

  @MinLength(6, {
    message: 'A confirmação de senha deve ter no mínimo 6 dígitos.',
  })
  @IsOptional()
  confirmPassword?: string;

  /**
   * ID do usuário a ser atualizado.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  @IsString({ message: 'ID deve ser no formato de texto.' })
  @IsOptional()
  targetUserId?: string;

  /**
   * ID da empresa.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */

  @IsOptional()
  companyId?: string;
}

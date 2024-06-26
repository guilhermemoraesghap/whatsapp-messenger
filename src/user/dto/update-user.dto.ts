import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto {
  /**
   * Email do usuário.
   *
   * @example johndoe@example.com
   */
  @IsEmail({}, { message: 'Insira um email válido.' })
  @IsNotEmpty({ message: 'Email não deve estar vazio.' })
  email: string;

  /**
   * Nome do usuário.
   *
   * @example John Doe
   */
  @IsString({ message: 'Nome deve ser no formato de texto.' })
  @IsNotEmpty({ message: 'Nome não deve estar vazio.' })
  name: string;

  /**
   * Nome de usuário.
   *
   * @example johndoe
   */
  @IsString({ message: 'Nome de usuário deve ser no formato de texto.' })
  @IsNotEmpty({ message: 'Username não deve estar vazio.' })
  username: string;

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
}

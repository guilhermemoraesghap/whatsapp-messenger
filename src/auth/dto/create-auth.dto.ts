import { IsNotEmpty } from 'class-validator';

class CreateAuthDto {
  /**
   * Senha de acesso do usuário.
   *
   * @example Abc@123
   */
  @IsNotEmpty({ message: 'Senha obrigatória.' })
  password: string;

  /**
   * Nome do usuário.
   *
   * @example John Doe
   */
  @IsNotEmpty({ message: 'Nome de usuário obrigatório.' })
  username: string;
}

export { CreateAuthDto };

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * Email do usuário.
   *
   * @example johndoe@example.com
   */
  @IsEmail({}, { message: 'Insira um email válido.' })
  @IsNotEmpty({ message: 'Email obrigatório.' })
  email: string;

  /**
   * Nome do usuário.
   *
   * @example John Doe
   */
  @IsString({ message: 'Nome deve ser no formato de texto.' })
  @IsNotEmpty({ message: 'Nome obrigatório.' })
  name: string;
}

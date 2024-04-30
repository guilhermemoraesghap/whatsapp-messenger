import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
}

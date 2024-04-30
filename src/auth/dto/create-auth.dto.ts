import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createAuthBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

class CreateAuthDto extends createZodDto(createAuthBodySchema) {
  /**
   * Senha de acesso do usuário.
   *
   * @example Abc@123
   */
  password: string;

  /**
   * Nome do usuário.
   *
   * @example John Doe
   */
  username: string;
}

export { createAuthBodySchema, CreateAuthDto };

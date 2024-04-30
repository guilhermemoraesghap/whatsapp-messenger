import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  /**
   * Nome da empresa.
   *
   * @example Company Ghost
   */
  name: string;

  /**
   * CNPJ da empresa.
   *
   * @example 12345678000111
   */
  cnpj: string;
}

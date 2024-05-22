import { IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  /**
   * Número de telefone do dispositivo da sessão.
   *
   * @example 553199999999
   */
  @IsNotEmpty({ message: 'Número de telefone obrigatório.' })
  phoneNumber: string;

  /**
   * Mensagem de texto enviada para o whatsapp.
   *
   * @example Olá, segue os dados do seu agendamento...
   */
  @IsNotEmpty({ message: 'Mensagem obrigatória.' })
  message: string;

  /**
   * ID do paciente na base de dados do MV.
   *
   * @example 9999999
   */
  @IsNotEmpty({ message: 'Identificador do paciente obrigatório.' })
  patientId: string;

  /**
   * Nome do paciente.
   *
   * @example John Doe
   */
  @IsNotEmpty({ message: 'Nomde do paciente obrigatório.' })
  patientName: string;

  /**
   * Id da empresa.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  @IsNotEmpty({ message: 'Identificador da empresa obrigatório.' })
  companyId: string;
}

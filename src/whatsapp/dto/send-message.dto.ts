export class SendMessageDto {
  /**
   * Número de telefone do dispositivo da sessão.
   *
   * @example 553199999999
   */
  phoneNumber: string;

  /**
   * Mensagem de texto enviada para o whatsapp.
   *
   * @example Olá, segue os dados do seu agendamento...
   */
  message: string;

  /**
   * ID do paciente na base de dados do MV.
   *
   * @example 9999999
   */
  patientId: string;

  /**
   * Nome do paciente.
   *
   * @example John Doe
   */
  patientName: string;

  /**
   * Id da empresa.
   *
   * @example 10858bca-6eea-49d0-a582-b2b4129da48c
   */
  companyId: string;
}

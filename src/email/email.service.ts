import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import * as dotenv from 'dotenv';

dotenv.config();

interface IEmailRequest {
  to: Array<string>;
  subject: string;
  text: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async sendEmail({ to, subject, text, html }: IEmailRequest) {
    const command = new SendEmailCommand({
      Source: process.env.EMAIL_SOURCE,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: text,
          },
          Html: {
            Data: html || '',
          },
        },
      },
    });

    try {
      await this.sesClient.send(command);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

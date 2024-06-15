import { Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './send-mail.dto';
import { SendMailModuleOptions } from './send-mail.interface';
import { MODULE_OPTIONS_TOKEN } from './send-mail.module-definition';

@Injectable()
export class LibrarySendMailService {
  private readonly logger: Logger = new Logger(LibrarySendMailService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    public readonly options: SendMailModuleOptions,
  ) {}

  async sendMailNodemailer(data: SendMailDto) {
    const nodemailerConfig = this.options.nodemailer;
    try {
      const transporter = nodemailer.createTransport({
        host: nodemailerConfig.host,
        port: nodemailerConfig.port,
        secure: false,
        auth: {
          user: nodemailerConfig.user,
          pass: nodemailerConfig.password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const info = await transporter.sendMail({
        from: nodemailerConfig.from,
        to: data.receivers,
        subject: data.subject,
        text: data.content,
        html: data.html,
      });

      this.logger.log(`Send nodemailer email sent! Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.log(`Send nodemailer failed!: ${error}`);
    }
  }
}

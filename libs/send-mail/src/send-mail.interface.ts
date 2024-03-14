import { IConfigNodemailer } from '@app/helpers/config-env/configuration';

export interface SendMailModuleOptions {
  nodemailer: IConfigNodemailer;
}

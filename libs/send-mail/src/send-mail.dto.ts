export class SendMailDto {
  receivers: string[];
  subject: string;
  content: string;
  html?: string;
}

import {
  OnQueueCompleted,
  OnQueueWaiting,
  OnQueueFailed,
  OnQueueDrained,
  OnQueueRemoved,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { Environment, MailContent, MailHtml, MailSubject, QueueProcessor } from 'libs/constants/enum';
import { IConfig } from '@app/helpers/config-env/configuration';
import { LibrarySendMailService } from '@app/send-mail';
import { IQueueSendMail } from './queue.service';
import { GlobalCacheService } from '@app/cache';
import * as format from 'string-format';
import { UtilsService } from '@app/helpers/utils/utils.service';
@Processor(QueueProcessor.PROCESS_SEND_MAIL)
export class SendMailQueue {
  private readonly logger = new Logger(SendMailQueue.name);

  constructor(
    private configService: ConfigService<IConfig, true>,
    private readonly sendMailService: LibrarySendMailService,
    @Inject(forwardRef(() => GlobalCacheService))
    private readonly globalCacheService: GlobalCacheService,
    private readonly utilService: UtilsService
  ) {}

  @Process(QueueProcessor.PROCESS_SEND_MAIL)
  async handleSendmailQueue(job: Job<IQueueSendMail>) {
    // TODO: COMMENT CODE TO FIX

    const nodeEnv = this.configService.get('nodeEnv');
    const data = job.data;
    const appName = this.configService.get('appName');
    const { type, receiversEmail, receiversId } = data;
    const metadata = data.metadata ? Object.assign(data.metadata, { appName }) : { appName };

    if (nodeEnv !== Environment.Production) {
      this.logger.log('send mail - handle : ', data);
    } else {
      this.logger.log('send mail - handle : ', job.id);
    }

    // const templateMail = await this.globalCacheService.getTemplateMail();

    // revert mail type key from type
    const mailType = this.utilService.revertKeyFromType(type);

    const templateMailByType =  {
      content: MailContent[mailType],
      subject: MailSubject[mailType],
      html: MailHtml[mailType],
    };

    console.log({templateMailByType})

    const content = format(templateMailByType.content, metadata);
    const subject = format(templateMailByType.subject, metadata);
    const html = format(templateMailByType.html, metadata);

    if (receiversEmail?.length) {
      await this.sendMailService.sendMailNodemailer({
        receivers: receiversEmail,
        content,
        subject,
        html,
      });
    }

    if (receiversId?.length) {
    }
  }

  @OnQueueWaiting()
  async onQueueWaiting(jobId: number | string) {
    // log sender
    this.logger.log(this.configService.get('nodemailer'));
    this.logger.log(`${SendMailQueue.name} - waiting: ${jobId}\n`);
  }

  @OnQueueDrained()
  async onQueueDrained() {
    this.logger.log(`${SendMailQueue.name} - drained\n`);
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, result: any) {
    this.logger.log(`${SendMailQueue.name} - Complete: ${job.id}\n`);
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, err: Error) {
    this.logger.error(
      `${SendMailQueue.name} - failed: ${job.id}.\n Reason: ${job.failedReason}.\n Error: ${err.message}`,
    );
  }

  @OnQueueRemoved()
  async onQueueRemoved(job: Job) {
    this.logger.log(`${SendMailQueue.name} - remove: ${job.id} successful\n`);
  }
}

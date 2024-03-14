import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import Bull, { Queue } from 'bull';
import {
  MailType,
  NotificationContent,
  NotificationRedirectType,
  NotificationTargetType,
  NotificationTitle,
  NotificationType,
  QueueProcessor,
} from 'libs/constants/enum';
export interface IQueueSendMail {
  receiversEmail?: string[];
  receiversId?: number[];
  type: MailType;
  metadata: { [key: string]: any };
}
export interface IQueuePushNotification {
  receiversId: number[];
  type: NotificationType;
  title: NotificationTitle;
  content: NotificationContent;
  targetType: NotificationTargetType;
  redirectType?: NotificationRedirectType;
  redirectId?: number;
  createdBy?: number;
  targetId?: number;
  metadata?: {};
}
@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(QueueProcessor.PROCESS_SEND_MAIL)
    private readonly sendMailQueue: Queue,
    @InjectQueue(QueueProcessor.PUSH_NOTIFICATION)
    private readonly pushNotification: Queue,
  ) {}

  async addSendMailQueue(data: IQueueSendMail, opts?: Bull.JobOptions) {
    await this.sendMailQueue.add(QueueProcessor.PROCESS_SEND_MAIL, data, { ...opts });
  }

  async addNotification(metadata: IQueuePushNotification, opts?: Bull.JobOptions) {
    return this.pushNotification.add(QueueProcessor.PUSH_NOTIFICATION, metadata, { ...opts });
  }
}

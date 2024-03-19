import Notification from '@app/database-type-orm/entities/task-manager/Notification';
import NotificationMember from '@app/database-type-orm/entities/task-manager/NotificationMember';
import { OnQueueCompleted, OnQueueFailed, OnQueueRemoved, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
  ConversationEvent,
  EmitterConstant,
  NotificationTargetType,
  NotificationType,
  QueueProcessor,
  UserProjectRole,
} from 'libs/constants/enum';
import { DataSource, In } from 'typeorm';
import { IQueuePushNotification } from './queue.service';
import * as format from 'string-format';
import { ConfigService } from '@nestjs/config';
import User from '@app/database-type-orm/entities/task-manager/User';
import UserProject from '@app/database-type-orm/entities/task-manager/UserProject';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Processor(QueueProcessor.PUSH_NOTIFICATION)
export class PushNotificationQueue {
  private readonly logger = new Logger(PushNotificationQueue.name);
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  @Process(QueueProcessor.PUSH_NOTIFICATION)
  async handlePushNotificationQueue(job: Job<IQueuePushNotification>) {
    return await this.dataSource.transaction(async (transaction) => {
      const notificationMemberRepository = transaction.getRepository(NotificationMember);
      const notificationRepository = transaction.getRepository(Notification);
      const userProjectRepository = transaction.getRepository(UserProject);

      const { receiversId, type, title, content, targetType, createdBy, redirectId, redirectType, metadata, targetId } =
        job.data;

      const metadataForMat = { ...metadata, appName: this.configService.get('appName') };
      const contentFormat = format(content, metadataForMat);
      const titleFormat = format(title, metadataForMat);

      const notification = await notificationRepository.save({
        type,
        title: titleFormat,
        content: contentFormat,
        targetType,
        createdBy,
        redirectId,
        redirectType,
        targetId,
      });

      if (targetType === NotificationTargetType.PROJECT && targetId) {
        const pmOrSubPmProject = await userProjectRepository.find({
          where: { role: In([UserProjectRole.PM, UserProjectRole.SUB_PM]), projectId: targetId },
          select: ['userId'],
        });

        if (pmOrSubPmProject.length) {
          receiversId.push(...pmOrSubPmProject.map((item) => item.userId));
        }
      }

      if (receiversId?.length) {
        await notificationMemberRepository.insert(
          receiversId.map((userId) => <NotificationMember>{ notificationId: notification.id, userId }),
        );

        this.eventEmitter.emitAsync(EmitterConstant.EMIT_TO_CLIENT, receiversId, ConversationEvent.NEW_NOTI);
      }

      return;
    });
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, result: any) {
    this.logger.log(`Queue - Complete: ${job.id}\n`);
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, err: Error) {
    this.logger.log(`Queue - failed: ${job.id}.\n Reason: ${job.failedReason}\n`);
  }

  @OnQueueRemoved()
  async onRemoved(job: Job, result: any) {
    this.logger.log(`Queue - removed: ${job.id}\n`);
  }
}

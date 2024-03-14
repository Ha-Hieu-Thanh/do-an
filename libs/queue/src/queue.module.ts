import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig, IConfigNodemailer, IConfigQueue } from '@app/helpers/config-env/configuration';
import { RedisOptions } from 'ioredis';
import { IConfigRedis } from '@app/helpers/config-env/configuration';
import { JobOptions, QueueOptions, RateLimiter } from 'bull';
import { QueueProcessor } from 'libs/constants/enum';
import { SendMailQueue } from './send-mail.processor';
import { LibrarySendMailModule } from '@app/send-mail';
import { PushNotificationQueue } from './push-notification.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import Notification from '@app/database-type-orm/entities/task-manager/Notification';
import NotificationMember from '@app/database-type-orm/entities/task-manager/NotificationMember';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IConfig, true>) =>
        <QueueOptions>{
          limiter: <RateLimiter>{
            max: 10, // Số lượng công việc tối đa được thực hiện trong một khoảng thời gian
            duration: 1000, // Khoảng thời gian (miligiây) trong đó số lượng công việc tối đa được thực hiện
          },
          redis: <RedisOptions>{
            host: configService.get<IConfigRedis>('redis').host,
            port: configService.get<IConfigRedis>('redis').port,
            db: configService.get<IConfigRedis>('redis').db,
            password: configService.get<IConfigRedis>('redis').password,
          },
          prefix: configService.get<IConfigQueue>('queue').prefix,
          defaultJobOptions: <JobOptions>{
            removeOnFail: true,
            removeOnComplete: true,
            attempts: 5,
            backoff: {
              type: 'exponential',
              delay: 5000,
            },
          },
        },
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      {
        name: QueueProcessor.PROCESS_SEND_MAIL,
      },
      {
        name: QueueProcessor.PUSH_NOTIFICATION,
      },
    ),
    LibrarySendMailModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        nodemailer: configService.get<IConfigNodemailer>('nodemailer'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Notification, NotificationMember]),
  ],
  providers: [QueueService, SendMailQueue, PushNotificationQueue],
  exports: [QueueService, SendMailQueue, PushNotificationQueue],
})
export class QueueModule {}

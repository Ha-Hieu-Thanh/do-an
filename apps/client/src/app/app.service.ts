import { LibraryS3UploadService } from '@app/s3-upload';
import { Injectable } from '@nestjs/common';
import { CommonStatus, NotificationTargetType, ReadNotification, UserProjectRole } from 'libs/constants/enum';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { GlobalCacheService } from '@app/cache';
import { InjectRepository } from '@nestjs/typeorm';
import Notification from '@app/database-type-orm/entities/task-manager/Notification';
import { In, Repository } from 'typeorm';
import NotificationMember from '@app/database-type-orm/entities/task-manager/NotificationMember';
import User from '@app/database-type-orm/entities/task-manager/User';
import { GetListNotificationDto } from './dto/list-notification.dto';
import { ReadNotificationsDto } from './dto/read-notifications.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly s3Upload: LibraryS3UploadService,
    private readonly utilsService: UtilsService,
    private readonly globalCacheService: GlobalCacheService,
    @InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationMember) private readonly notificationMemberRepository: Repository<NotificationMember>,
  ) {}

  async clearCache() {
    await this.globalCacheService.resetCache();
    return true;
  }

  async healthCheck(ip: string) {
    return ip;
  }

  async uploadFiles(files: Array<Express.Multer.File>) {
    return this.s3Upload.uploadFiles(files);
  }

  async getListNotification(userId: number, query: GetListNotificationDto) {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('n')
      .innerJoinAndMapOne(
        'n.notificationMember',
        NotificationMember,
        'nm',
        'nm.notificationId = n.id AND nm.userId = :userId',
        { userId },
      )
      .leftJoinAndMapOne('n.createdBy', User, 'uc', 'uc.id = n.createdBy')
      .select([
        'n.id',
        'n.title',
        'n.content',
        'n.targetType',
        'n.targetId',
        'n.redirectType',
        'n.redirectId',
        'n.createdAt',
        'n.type',
        'nm.isRead',
        'nm.status',
        'uc.id',
        'uc.name',
        'uc.avatar',
      ]);

    if (query.hasOwnProperty('isRead')) {
      queryBuilder.andWhere('nm.isRead = :isRead', { isRead: query.isRead });
    }

    const [results, totalItems] = await queryBuilder
      .orderBy('n.id', 'DESC')
      .skip(query.skip)
      .take(query.pageSize)
      .getManyAndCount();

    this.utilsService.assignThumbURLVer2(results, ['createdBy', 'avatar']);

    const countNotiUnread = await this.getCountNotiUnread(userId);
    return this.utilsService.returnPaging(results, totalItems, query, { countNotiUnread });
  }

  async getCountNotiUnread(userId: number) {
    return this.notificationRepository
      .createQueryBuilder('n')
      .innerJoinAndMapOne(
        'n.notificationMember',
        NotificationMember,
        'nm',
        'nm.notificationId = n.id AND nm.userId = :userId',
        { userId },
      )
      .where('nm.isRead = :isRead AND n.status = :status', {
        isRead: ReadNotification.UNREAD,
        status: CommonStatus.ACTIVE,
      })
      .getCount();
  }

  async readNotifications(userId: number, params: ReadNotificationsDto) {
    if (!params.isReadAll && params.notificationIds) {
      await this.notificationMemberRepository.update(
        { userId, notificationId: In(params.notificationIds) },
        { isRead: ReadNotification.READ },
      );
      return true;
    } else {
      await this.notificationMemberRepository.update(
        { userId, isRead: ReadNotification.UNREAD },
        { isRead: ReadNotification.READ },
      );
      return true;
    }
  }
}

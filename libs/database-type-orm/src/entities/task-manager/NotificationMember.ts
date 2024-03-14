import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonStatus, ReadNotification } from '../../../../constants/enum';
import Notification from './Notification';
import User from './User';

@Entity('notification_member')
export default class NotificationMember {
  @PrimaryColumn({ name: 'notification_id', type: 'bigint', unsigned: true })
  notificationId: number;

  @PrimaryColumn({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({
    name: 'is_read',
    type: 'tinyint',
    default: ReadNotification.UNREAD,
  })
  isRead: ReadNotification;

  @Column({
    name: 'status',
    type: 'tinyint',
    default: CommonStatus.ACTIVE,
  })
  status: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: string;

  /* -------------------------------- relation ------------------------------- */
  @ManyToOne(() => Notification, (notification) => notification.notificationMembers)
  @JoinColumn({ name: 'notification_id' })
  notification: Notification;

  @ManyToOne(() => User, (user) => user.notificationMembers)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

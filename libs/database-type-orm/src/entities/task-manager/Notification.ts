import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CommonStatus,
  NotificationRedirectType,
  NotificationTargetType,
  NotificationType,
} from '../../../../constants/enum';
import NotificationMember from './NotificationMember';

@Entity('notification')
export default class Notification {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'status', type: 'tinyint', default: CommonStatus.ACTIVE })
  status: number;

  @Column({ name: 'type', type: 'tinyint', nullable: true })
  type?: NotificationType;

  @Column({ name: 'title', type: 'varchar', length: '500', nullable: true })
  title?: string;

  @Column({ name: 'content', type: 'varchar', length: '3000', nullable: true })
  content?: string;

  @Column({
    name: 'redirect_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  redirectId?: number;

  @Column({ name: 'redirect_type', type: 'tinyint', nullable: true })
  redirectType?: NotificationRedirectType;

  @Column({ name: 'target_type', type: 'tinyint', nullable: false })
  targetType: NotificationTargetType;

  @Column({
    name: 'target_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  targetId?: number;

  @Column({
    name: 'created_by',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  createdBy: number;

  @Column({
    name: 'deleted_by',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  deletedBy: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
  })
  createdAt?: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt?: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: string;

  /* -------------------------------- relation ------------------------------- */
  @OneToMany(() => NotificationMember, (notificationMember) => notificationMember.notification)
  notificationMembers: NotificationMember[];
}

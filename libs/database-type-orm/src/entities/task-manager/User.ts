import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ClientLoginType, CommonStatus, Gender, UserRole, UserStatus } from '../../../../constants/enum';
import Project from './Project';
import UserProject from './UserProject';
import NotificationMember from './NotificationMember';
import UserCategory from './UserLeadCategory';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({
    name: 'login_type',
    type: 'tinyint',
    unsigned: true,
    nullable: true,
    comment: 'Type dang nhap cua ben thu ba eg. fb, yahoo...',
  })
  loginType: ClientLoginType;

  @Column({
    name: 'sns_id',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Id dang nhap cua ben thu ba',
  })
  snsId: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'avatar',
    type: 'varchar',
    nullable: true,
  })
  avatar?: string;

  @Column({
    name: 'retry_otp_count',
    type: 'tinyint',
    unsigned: true,
    default: 0,
    comment: 'Số lần tài khoản nhập mã otp trong 1 khoảng thời gian',
  })
  retryOtpCount: number;

  @CreateDateColumn({ name: 'expire_retry_otp', type: 'datetime', nullable: true })
  expireRetryOtp: string;

  @Column({ name: 'gender', type: 'tinyint', unsigned: true, nullable: true })
  gender: Gender;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string;

  @Column({ name: 'birthday', type: 'varchar', nullable: true })
  birthday: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
    select: true,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 100,
    select: false,
    nullable: true,
  })
  password: string;

  @Column({ name: 'phone', type: 'varchar', length: 30, nullable: true })
  phone: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 500,
    select: false,
    nullable: true,
  })
  refreshToken: string;

  @Column({
    name: 'status',
    type: 'tinyint',
    unsigned: true,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    name: 'token_exp',
    type: 'timestamp',
    nullable: true,
  })
  tokenExp: string;

  @Column({
    name: 'is_test_account',
    type: 'tinyint',
    unsigned: true,
    default: CommonStatus.IN_ACTIVE,
  })
  isTestAccount: number;

  @Column({ name: 'invite_code', type: 'varchar', length: 255, nullable: true, select: false })
  inviteCode: string | null;

  @Column({ name: 'token_forgot_password', type: 'varchar', length: 500, nullable: true, select: false })
  tokenForgotPassword: string | null;

  @Column({
    name: 'last_time_forgot_password',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  lastTimeForgotPassword?: string | null;

  @Column({
    name: 'role',
    type: 'tinyint',
    unsigned: true,
    nullable: true,
    default: UserRole.USER,
    comment: 'Role cua user',
  })
  role: UserRole;

  @Column({
    name: 'updated_by',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  updatedBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;

  /* -------------------------------- relation -------------------------------- */
  @OneToMany(() => Project, (project) => project.created)
  projects: Project[];

  @OneToMany(() => UserProject, (userProject) => userProject.user)
  usersProject: UserProject[];

  @OneToMany(() => NotificationMember, (notificationMember) => notificationMember.user)
  notificationMembers: NotificationMember[];
}

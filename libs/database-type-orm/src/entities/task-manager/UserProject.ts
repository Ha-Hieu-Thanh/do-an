import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProjectRole, UserProjectStatus } from '../../../../constants/enum';
import User from './User';
import Project from './Project';
import UserLeadCategory from './UserLeadCategory';

@Entity('user_project')
export default class UserProject {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ name: 'project_id', type: 'bigint', unsigned: true })
  projectId: number;

  @Index()
  @Column({
    name: 'role',
    type: 'tinyint',
    unsigned: true,
  })
  role: UserProjectRole;

  @Column({
    name: 'status',
    type: 'tinyint',
    unsigned: true,
    default: UserProjectStatus.ACTIVE,
  })
  status: UserProjectStatus;

  @Column({ name: 'issue_count', type: 'bigint', unsigned: true, default: 0 })
  issueCount: number;

  @Column({
    name: 'created_by',
    type: 'bigint',
    unsigned: true,
  })
  createdBy: number;

  @Column({
    name: 'updated_by',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  updatedBy?: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;

  /* -------------------------------- relation ------------------------------- */
  @ManyToOne(() => User, (user) => user.usersProject)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Project, (project) => project.userProjects)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => UserLeadCategory, (userLeadCategory) => userLeadCategory.userProject)
  userLeadCategories: UserLeadCategory[];
}

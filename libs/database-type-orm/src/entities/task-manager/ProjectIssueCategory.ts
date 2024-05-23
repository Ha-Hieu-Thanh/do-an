import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectIssueCategoryStatus } from '../../../../constants/enum';
import Project from './Project';
import UserLeadCategory from './UserLeadCategory';

@Entity('project_issue_category')
export default class ProjectIssueCategory {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Index()
  @Column({ name: 'project_id', type: 'bigint', unsigned: true })
  projectId: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'status',
    type: 'tinyint',
    unsigned: true,
    default: ProjectIssueCategoryStatus.ACTIVE,
  })
  status: ProjectIssueCategoryStatus;

  @Column({ name: 'issue_count', type: 'bigint', unsigned: true, default: 0 })
  issueCount: number;

  @Column({ name: 'description', type: 'varchar', length: 3000, nullable: true })
  description?: string;

  @Column({ name: 'order', type: 'bigint', nullable: true })
  order: number | null;

  @Column({ name: 'is_first', type: 'boolean', default: false })
  isFirst: boolean;

  @Column({ name: 'is_last', type: 'boolean', default: false })
  isLast: boolean;

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
  @ManyToOne(() => Project, (project) => project.projectIssueCategories)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => UserLeadCategory, (userLeadCategory) => userLeadCategory.category)
  userLeadCategories: UserLeadCategory[];
}

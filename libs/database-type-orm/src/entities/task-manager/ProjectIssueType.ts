import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectIssueTypeStatus } from '../../../../constants/enum';
import Project from './Project';

@Entity('project_issue_type')
export default class ProjectIssueType {
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
    default: ProjectIssueTypeStatus.ACTIVE,
  })
  status: ProjectIssueTypeStatus;

  @Column({
    name: 'background_color',
    type: 'varchar',
    length: 50,
  })
  backgroundColor: string;

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

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

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
  @ManyToOne(() => Project, (project) => project.projectIssueTypes)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}

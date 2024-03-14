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
import { IssueStatus, Priority } from '../../../../constants/enum';
import Project from './Project';
import IssueHistory from './IssueHistory';

@Entity('issue')
export default class Issue {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'subject', type: 'varchar', nullable: true })
  subject: string;

  @Index()
  @Column({ name: 'project_id', type: 'bigint', unsigned: true })
  projectId: number;

  @Index()
  @Column({ name: 'assignee_id', type: 'bigint', unsigned: true })
  assigneeId: number;

  @Index()
  @Column({ name: 'category_id', type: 'bigint', unsigned: true, nullable: true })
  categoryId: number;

  @Index()
  @Column({ name: 'state_id', type: 'bigint', unsigned: true, nullable: true })
  stateId: number;

  @Index()
  @Column({ name: 'type_id', type: 'bigint', unsigned: true, nullable: true })
  typeId: number;

  @Index()
  @Column({ name: 'version_id', type: 'bigint', unsigned: true, nullable: true })
  versionId: number;

  @Column({ name: 'order', type: 'bigint' })
  order: number;

  @Column({ name: 'description', type: 'varchar', length: 3000, nullable: true })
  description?: string;

  @Column({
    name: 'status',
    type: 'tinyint',
    unsigned: true,
    default: IssueStatus.ACTIVE,
  })
  status: IssueStatus;

  @Column({
    name: 'priority',
    type: 'tinyint',
    unsigned: true,
    default: Priority.NORMAL,
  })
  priority: Priority;

  @Column({
    name: 'start_date',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  startDate: string;

  @Column({
    name: 'due_date',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  dueDate: string;

  @Column({
    name: 'estimated_hours',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  estimatedHours: number;

  @Column({
    name: 'actual_hours',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  actualHours: number;

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

  /* -------------------------------- relation -------------------------------- */
  @ManyToOne(() => Project, (project) => project.issues)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => IssueHistory, (issueHistory) => issueHistory.issue)
  issueHistories: IssueHistory[];
}

import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Issue from './Issue';
import Project from './Project';
import { IssueHistoryType } from '../../../../constants/enum';

@Entity('issue_history')
export default class IssueHistory {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Index()
  @Column({ name: 'issue_id', type: 'bigint', unsigned: true })
  issueId: number;

  @Index()
  @Column({ name: 'project_id', type: 'bigint', unsigned: true })
  projectId: number;

  @Column({
    name: 'metadata',
    type: 'json',
    nullable: true,
  })
  metadata: string;

  @Column({
    name: 'type',
    type: 'tinyint',
    unsigned: true,
  })
  type: IssueHistoryType;

  @Column({
    name: 'created_by',
    type: 'bigint',
    unsigned: true,
  })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  /* -------------------------------- relation ------------------------------- */
  @ManyToOne(() => Issue, (issue) => issue.issueHistories)
  @JoinColumn({ name: 'issue_id' })
  issue: Issue;

  @ManyToOne(() => Project, (project) => project.issueHistories)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}

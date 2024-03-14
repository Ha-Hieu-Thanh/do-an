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
import { ProjectState, ProjectStatus, ProjectType } from '../../../../constants/enum';
import User from './User';
import UserProject from './UserProject';
import ProjectIssueType from './ProjectIssueType';
import ProjectIssueCategory from './ProjectIssueCategory';
import ProjectVersion from './ProjectVersion';
import ProjectIssueState from './ProjectIssueState';
import Issue from './Issue';
import IssueHistory from './IssueHistory';
import { Wiki } from './Wiki';

@Entity('project')
export default class Project {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'member_count', type: 'bigint', unsigned: true, default: 1 })
  memberCount: number;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
  })
  name?: string;

  @Column({ name: 'key', type: 'varchar', unique: true })
  key: string;

  @Column({
    name: 'state',
    type: 'tinyint',
    unsigned: true,
    default: ProjectState.ACTIVE,
  })
  state: ProjectState;

  @Column({
    name: 'status',
    type: 'tinyint',
    unsigned: true,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @Column({
    name: 'type',
    type: 'tinyint',
    unsigned: true,
    default: ProjectType.COMMON,
  })
  type: ProjectType;

  @Column({
    name: 'avatar',
    type: 'varchar',
    nullable: true,
  })
  avatar?: string;

  @Column({ name: 'issue_count', type: 'bigint', unsigned: true, default: 0 })
  issueCount: number;

  @Index()
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
  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'created_by' })
  created: User;

  @OneToMany(() => UserProject, (userProject) => userProject.project)
  userProjects: UserProject[];

  @OneToMany(() => ProjectIssueType, (projectIssueType) => projectIssueType.project)
  projectIssueTypes: ProjectIssueType[];

  @OneToMany(() => ProjectIssueCategory, (projectIssueCategory) => projectIssueCategory.project)
  projectIssueCategories: ProjectIssueCategory[];

  @OneToMany(() => ProjectVersion, (projectVersion) => projectVersion.project)
  projectVersions: ProjectVersion[];

  @OneToMany(() => ProjectIssueState, (projectIssueState) => projectIssueState.project)
  projectIssueStates: ProjectIssueState[];

  @OneToMany(() => Issue, (issue) => issue.project)
  issues: Issue[];

  @OneToMany(() => IssueHistory, (issueHistory) => issueHistory.project)
  issueHistories: IssueHistory[];

  @OneToMany(() => Wiki, (wiki) => wiki.project)
  wiki: Wiki[];
}

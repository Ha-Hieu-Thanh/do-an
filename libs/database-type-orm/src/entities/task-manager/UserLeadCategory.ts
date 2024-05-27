import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import ProjectIssueCategory from './ProjectIssueCategory';
import UserProject from './UserProject';

@Entity('user_lead_category')
export default class UserLeadCategory {
  @PrimaryColumn({ name: 'user_project_id', type: 'bigint', unsigned: true })
  userProjectId: number;

  @PrimaryColumn({ name: 'category_id', type: 'bigint', unsigned: true })
  categoryId: number;

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
  @ManyToOne(() => UserProject, (userProject) => userProject.userLeadCategories)
  @JoinColumn({ name: 'user_project_id' })
  userProject: UserProject;

  @ManyToOne(() => ProjectIssueCategory, (category) => category.userLeadCategories)
  @JoinColumn({ name: 'category_id' })
  category: ProjectIssueCategory;
}

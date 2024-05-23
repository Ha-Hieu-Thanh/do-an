import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import User from './User';
import ProjectIssueCategory from './ProjectIssueCategory';
import Project from './Project';

@Entity('user_category')
export default class UserCategory {
  @PrimaryColumn({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @PrimaryColumn({ name: 'category_id', type: 'bigint', unsigned: true })
  categoryId: number;

  @PrimaryColumn({ name: 'project_id', type: 'bigint', unsigned: true })
  projectId: number;

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
  @ManyToOne(() => User, (user) => user.userCategories)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ProjectIssueCategory, (category) => category.userCategories)
  @JoinColumn({ name: 'category_id' })
  category: ProjectIssueCategory;

  @ManyToOne(() => Project, (project) => project.userCategories)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}

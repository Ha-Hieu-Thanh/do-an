import { WikiStatus } from '../../../../constants/enum';
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
import Project from './Project';

@Entity('wiki')
export class Wiki {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'subject', type: 'varchar' })
  subject: string;

  @Column({ name: 'content', type: 'text', nullable: false })
  content?: string;

  @Index()
  @Column({ name: 'project_id', type: 'bigint', unsigned: true, nullable: true })
  projectId: number;

  @Column({
    name: 'status',
    type: 'tinyint',
    unsigned: true,
    default: WikiStatus.ACTIVE,
  })
  status: WikiStatus;

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
  @ManyToOne(() => Project, (project) => project.wiki)
  @JoinColumn({ name: 'project_id' })
  project?: Project | null;
}

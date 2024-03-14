import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Issue from '@app/database-type-orm/entities/task-manager/Issue';
import IssueHistory from '@app/database-type-orm/entities/task-manager/IssueHistory';
import UserProject from '@app/database-type-orm/entities/task-manager/UserProject';
import ProjectIssueState from '@app/database-type-orm/entities/task-manager/ProjectIssueState';
import { QueueModule } from '@app/queue';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, IssueHistory, UserProject, ProjectIssueState]), QueueModule],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}

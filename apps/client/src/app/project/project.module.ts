import Project from '@app/database-type-orm/entities/task-manager/Project';
import UserProject from '@app/database-type-orm/entities/task-manager/UserProject';
import { HelpersModule } from '@app/helpers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueCategoryModule } from './issue-category/issue-category.module';
import { IssueStateModule } from './issue-state/issue-state.module';
import { IssueTypeModule } from './issue-type/issue-type.module';
import { IssueModule } from './issue/issue.module';
import { MemberModule } from './member/member.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { VersionModule } from './version/version.module';
import { WikiModule } from './wiki/wiki.module';
import { QueueModule } from '@app/queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, UserProject]),
    HelpersModule,
    MemberModule,
    IssueTypeModule,
    IssueCategoryModule,
    IssueStateModule,
    VersionModule,
    IssueModule,
    WikiModule,
    QueueModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}

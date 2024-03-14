import { Module } from '@nestjs/common';
import { IssueStateService } from './issue-state.service';
import { IssueStateController } from './issue-state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProjectIssueState from '@app/database-type-orm/entities/task-manager/ProjectIssueState';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectIssueState])],
  controllers: [IssueStateController],
  providers: [IssueStateService]
})
export class IssueStateModule {}

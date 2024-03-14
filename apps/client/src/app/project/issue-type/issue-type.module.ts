import { Module } from '@nestjs/common';
import { IssueTypeService } from './issue-type.service';
import { IssueTypeController } from './issue-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProjectIssueType from '@app/database-type-orm/entities/task-manager/ProjectIssueType';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectIssueType])],
  controllers: [IssueTypeController],
  providers: [IssueTypeService],
})
export class IssueTypeModule {}

import { Module } from '@nestjs/common';
import { IssueCategoryService } from './issue-category.service';
import { IssueCategoryController } from './issue-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProjectIssueCategory from '@app/database-type-orm/entities/task-manager/ProjectIssueCategory';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectIssueCategory])],
  controllers: [IssueCategoryController],
  providers: [IssueCategoryService],
})
export class IssueCategoryModule {}

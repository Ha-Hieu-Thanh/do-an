import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Issue from '@app/database-type-orm/entities/task-manager/Issue';
import IssueHistory from '@app/database-type-orm/entities/task-manager/IssueHistory';
import UserProject from '@app/database-type-orm/entities/task-manager/UserProject';
import ProjectIssueState from '@app/database-type-orm/entities/task-manager/ProjectIssueState';
import { QueueModule } from '@app/queue';
import { LibraryS3UploadModule } from '@app/s3-upload';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Issue, IssueHistory, UserProject, ProjectIssueState]),
    QueueModule,
    LibraryS3UploadModule,
    HttpModule,
    ElasticsearchModule.register({
      node: 'http://my-elasticsearch:9200',
    }),
  ],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}

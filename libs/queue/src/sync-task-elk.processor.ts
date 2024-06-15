import {
  OnQueueCompleted,
  OnQueueDrained,
  OnQueueFailed,
  OnQueueRemoved,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Job } from 'bull';
import { QueueProcessor } from 'libs/constants/enum';
import { ISyncTaskElk } from './queue.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { GlobalCacheService } from '@app/cache';

@Processor(QueueProcessor.SYNC_TASK_ELK)
export class SyncTaskElkQueue {
  private readonly logger = new Logger(SyncTaskElkQueue.name);
  constructor(
    private readonly elasticSearchService: ElasticsearchService,
    private readonly httpService: HttpService,
    private readonly globalCacheService: GlobalCacheService,
  ) {}

  @Process(QueueProcessor.SYNC_TASK_ELK)
  async handleSyncTaskElkQueue(job: Job<ISyncTaskElk>) {
    const { id, issue, type } = job.data;

    const projectId = issue.projectId;

    const projectKey = (await this.globalCacheService.getProjectInfo(projectId)).key;

    this.logger.log(`SyncTaskElkQueue - handle: ${id} - ${issue.id}\n`);
    if (type === 'create') {
      // create vector embedding
      const text = `${issue.subject}` + `${issue.description} || ""`;

      const vectorEmbedding = (await lastValueFrom(this.httpService.post('http://127.0.0.1:8000/embed/', { text })))
        .data?.embedding;

      await this.elasticSearchService.index({
        index: 'task',
        body: {
          id: issue.id,
          subject: issue.subject,
          projectId: issue.projectId,
          assigneeId: issue.assigneeId,
          categoryId: issue.categoryId,
          stateId: issue.stateId,
          typeId: issue.typeId,
          versionId: issue.versionId,
          order: issue.order,
          description: issue.description,
          status: issue.status,
          priority: issue.priority,
          startDate: issue.startDate,
          dueDate: issue.dueDate,
          estimatedHours: issue.estimatedHours,
          actualHours: issue.actualHours,
          createdBy: issue.createdBy,
          updatedBy: issue.updatedBy,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,

          issueKey: `${projectKey}-${id}`,
          vectorEmbedding,
        },
      });
    } else if (type == 'update') {
      // get id of doc have issue.id equal id
      const { hits } = await this.elasticSearchService.search({
        index: 'task',
        body: {
          query: {
            match: {
              id: issue.id,
            },
          },
        },
      });

      if (((hits?.total as any)?.value as number) > 0) {
        const docId = hits.hits[0]._id;
        // create vector embedding
        let vectorEmbedding = (hits.hits[0] as any)._source.vectorEmbedding;
        if (
          (hits.hits[0] as any)._source.subject !== issue.subject ||
          (hits.hits[0] as any)._source.description !== issue.description
        ) {
          const text = `${issue.subject}` + `${issue.description || ''}`;
          vectorEmbedding = (await lastValueFrom(this.httpService.post('http://127.0.0.1:8000/embed/', { text }))).data
            ?.embedding;
        }

        await this.elasticSearchService.update({
          index: 'task',
          id: docId,

          body: {
            doc: {
              subject: issue.subject,
              projectId: issue.projectId,
              assigneeId: issue.assigneeId,
              categoryId: issue.categoryId,
              stateId: issue.stateId,
              typeId: issue.typeId,
              versionId: issue.versionId,
              order: issue.order,
              description: issue.description,
              status: issue.status,
              priority: issue.priority,
              startDate: issue.startDate,
              dueDate: issue.dueDate,
              estimatedHours: issue.estimatedHours,
              actualHours: issue.actualHours,
              createdBy: issue.createdBy,
              updatedBy: issue.updatedBy,
              createdAt: issue.createdAt,
              updatedAt: issue.updatedAt,

              issueKey: `${projectKey}-${id}`,
              vectorEmbedding,
            },
          },
        });
      }
    }
  }

  @OnQueueWaiting()
  async onQueueWaiting(jobId: number | string) {
    this.logger.log(`${SyncTaskElkQueue.name} - waiting: ${jobId}\n`);
  }

  @OnQueueDrained()
  async onQueueDrained() {
    this.logger.log(`${SyncTaskElkQueue.name} - drained\n`);
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, result: any) {
    this.logger.log(`${SyncTaskElkQueue.name} - Complete: ${job.id}\n`);
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, err: Error) {
    this.logger.error(
      `${SyncTaskElkQueue.name} - failed: ${job.id}.\n Reason: ${job.failedReason}.\n Error: ${err.message}`,
    );
  }

  @OnQueueRemoved()
  async onQueueRemoved(job: Job) {
    this.logger.log(`${SyncTaskElkQueue.name} - remove: ${job.id} successful\n`);
  }
}

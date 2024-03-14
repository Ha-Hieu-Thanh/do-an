import { Injectable } from '@nestjs/common';
import { ListProjectIssueStateDto } from './dto/list-project-state-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import ProjectIssueState from '@app/database-type-orm/entities/task-manager/ProjectIssueState';
import { DataSource, Repository } from 'typeorm';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { ProjectIssueStateStatus, TypeCacheData } from 'libs/constants/enum';
import { CreateProjectIssueStateDto } from './dto/create-project-issue-state.dto';
import { UpdateProjectIssueStateDto } from './dto/update-project-issue-type.dto';
import { GlobalCacheService } from '@app/cache';

@Injectable()
export class IssueStateService {
  constructor(
    @InjectRepository(ProjectIssueState) private readonly projectIssueStateRepository: Repository<ProjectIssueState>,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    private readonly globalCacheService: GlobalCacheService,
  ) {}

  async listProjectIssueState(userId: number, projectId: number, query: ListProjectIssueStateDto) {
    const queryBuilder = this.projectIssueStateRepository
      .createQueryBuilder('pis')
      .select(['pis.id', 'pis.issueCount', 'pis.name', 'pis.backgroundColor', 'pis.description', 'pis.order'])
      .where('pis.projectId = :projectId AND pis.status = :projectIssueStateStatusActive', {
        projectId,
        projectIssueStateStatusActive: ProjectIssueStateStatus.ACTIVE,
      });

    const [results, totalItems] = await queryBuilder
      .orderBy('pis.order', 'DESC')
      .skip(query.skip)
      .take(query.pageSize)
      .getManyAndCount();

    return this.utilsService.returnPaging(results, totalItems, query);
  }

  async createProjectIssueState(userId: number, projectId: number, params: CreateProjectIssueStateDto) {
    return await this.dataSource.transaction(async (transaction) => {
      const projectIssueStateRepository = transaction.getRepository(ProjectIssueState);

      const firstProjectIssueCurrent = await projectIssueStateRepository.findOne({
        where: { projectId, status: ProjectIssueStateStatus.ACTIVE, isFirst: true },

        select: ['id', 'order', 'status', 'projectId', 'isFirst', 'isLast'],
      });

      if (firstProjectIssueCurrent?.order) {
        await projectIssueStateRepository.update({ id: firstProjectIssueCurrent.id }, { isFirst: false });
        await projectIssueStateRepository.insert({
          ...params,
          projectId,
          isFirst: true,
          createdBy: userId,
          order: firstProjectIssueCurrent.order + 1,
        });
      }

      if (!firstProjectIssueCurrent) {
        await projectIssueStateRepository.insert({
          ...params,
          projectId,
          isFirst: true,
          isLast: true,
          createdBy: userId,
          order: 1,
        });
      }

      await this.globalCacheService.delByTypeKey(TypeCacheData.PROJECT_INFORMATION, projectId);

      return true;
    });
  }

  async detailProjectIssueState(userId: number, projectId: number, issueStateId: number) {
    return await this.projectIssueStateRepository.findOne({
      where: { id: issueStateId, projectId, status: ProjectIssueStateStatus.ACTIVE },
    });
  }

  async updateProjectIssueState(
    userId: number,
    projectId: number,
    {
      projectIssueStateId: projectIssueStateMainId,
      projectIssueStatePreId,
      projectIssueStatePostId,
      status,
      ...params
    }: UpdateProjectIssueStateDto,
  ) {
    return await this.dataSource.transaction(async (transaction) => {
      const projectIssueStateRepository = transaction.getRepository(ProjectIssueState);

      const result = await this.utilsService.handleLogicUpdateOrder(
        projectIssueStateMainId,
        projectIssueStatePostId,
        projectIssueStatePreId,
        projectId,
        status,
        ProjectIssueStateStatus.ACTIVE,
        projectIssueStateRepository,
        params,
      );
      await this.globalCacheService.delByTypeKey(TypeCacheData.PROJECT_INFORMATION, projectId);
      return result;
    });
  }
}

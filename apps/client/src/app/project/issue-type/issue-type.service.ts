import ProjectIssueType from '@app/database-type-orm/entities/task-manager/ProjectIssueType';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectIssueTypeStatus, TypeCacheData } from 'libs/constants/enum';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectIssueTypeDto } from './dto/create-project-issue-type.dto';
import { ListProjectIssueTypeDto } from './dto/list-project-issue-type.dto';
import { UpdateProjectIssueTypeDto } from './dto/update-project-issue-type.dto';
import { GlobalCacheService } from '@app/cache';
interface IProjectIssueTypesById {
  [key: string]: {
    id: number;
    projectId: number;
    order: number;
    isFirst: boolean;
    isLast: boolean;
  };
}

@Injectable()
export class IssueTypeService {
  constructor(
    @InjectRepository(ProjectIssueType) private readonly projectIssueTypeRepository: Repository<ProjectIssueType>,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    private readonly globalCacheService: GlobalCacheService,
  ) {}

  async listProjectIssueType(userId: number, projectId: number, query: ListProjectIssueTypeDto) {
    const queryBuilder = this.projectIssueTypeRepository
      .createQueryBuilder('pit')
      .select(['pit.id', 'pit.issueCount', 'pit.name', 'pit.backgroundColor', 'pit.description', 'pit.order'])
      .where('pit.projectId = :projectId AND pit.status = :projectIssueTypeStatusActive', {
        projectId,
        projectIssueTypeStatusActive: ProjectIssueTypeStatus.ACTIVE,
      });

    const [results, totalItems] = await queryBuilder
      .orderBy('pit.order', 'DESC')
      .skip(query.skip)
      .take(query.pageSize)
      .getManyAndCount();

    return this.utilsService.returnPaging(results, totalItems, query);
  }

  async updateProjectIssueType(
    userId: number,
    projectId: number,
    {
      projectIssueTypeId: projectIssueTypeMainId,
      projectIssueTypePreId,
      projectIssueTypePostId,
      status,
      ...params
    }: UpdateProjectIssueTypeDto,
  ) {
    return await this.dataSource.transaction(async (transaction) => {
      const projectIssueTypeRepository = transaction.getRepository(ProjectIssueType);

      const result = await this.utilsService.handleLogicUpdateOrder(
        projectIssueTypeMainId,
        projectIssueTypePostId,
        projectIssueTypePreId,
        projectId,
        status,
        ProjectIssueTypeStatus.ACTIVE,
        projectIssueTypeRepository,
        params,
      );
      await this.globalCacheService.delByTypeKey(TypeCacheData.PROJECT_INFORMATION, projectId);
      return result;
    });
  }

  async createProjectIssueType(userId: number, projectId: number, params: CreateProjectIssueTypeDto) {
    return await this.dataSource.transaction(async (transaction) => {
      const projectIssueTypeRepository = transaction.getRepository(ProjectIssueType);

      const firstProjectIssueCurrent = await projectIssueTypeRepository.findOne({
        where: { projectId, status: ProjectIssueTypeStatus.ACTIVE, isFirst: true },

        select: ['id', 'order', 'status', 'projectId', 'isFirst', 'isLast'],
      });

      if (firstProjectIssueCurrent?.order) {
        await projectIssueTypeRepository.update({ id: firstProjectIssueCurrent.id }, { isFirst: false });
        await projectIssueTypeRepository.insert({
          ...params,
          projectId,
          isFirst: true,
          createdBy: userId,
          order: firstProjectIssueCurrent.order + 1,
        });
      }

      if (!firstProjectIssueCurrent) {
        await projectIssueTypeRepository.insert({
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

  async detailProjectIssueType(userId: number, projectId: number, issueTypeId: number) {
    return await this.projectIssueTypeRepository.findOne({
      where: { id: issueTypeId, projectId, status: ProjectIssueTypeStatus.ACTIVE },
    });
  }
}

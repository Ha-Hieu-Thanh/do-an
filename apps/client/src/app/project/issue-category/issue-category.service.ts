import { Injectable } from '@nestjs/common';
import { ListProjectIssueCategoryDto } from './dto/list-project-issue-category.dto';
import ProjectIssueCategory from '@app/database-type-orm/entities/task-manager/ProjectIssueCategory';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { ProjectIssueCategoryStatus, TypeCacheData } from 'libs/constants/enum';
import { CreateProjectIssueCategoryDto } from './dto/create-project-issue-category.dto';
import { UpdateProjectIssueCategoryDto } from './dto/update-project-issue-type.dto';
import { GlobalCacheService } from '@app/cache';

@Injectable()
export class IssueCategoryService {
  constructor(
    @InjectRepository(ProjectIssueCategory)
    private readonly projectIssueCategoryRepository: Repository<ProjectIssueCategory>,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    private readonly globalCacheService: GlobalCacheService,
  ) {}
  async listProjectIssueCategory(userId: number, projectId: number, query: ListProjectIssueCategoryDto) {
    const queryBuilder = this.projectIssueCategoryRepository
      .createQueryBuilder('pic')
      .select(['pic.id', 'pic.issueCount', 'pic.name', 'pic.description', 'pic.order'])
      .where('pic.projectId = :projectId AND pic.status = :projectIssueCategoryStatus', {
        projectId,
        projectIssueCategoryStatus: ProjectIssueCategoryStatus.ACTIVE,
      });

    const [results, totalItems] = await queryBuilder
      .orderBy('pic.order', 'DESC')
      .skip(query.skip)
      .take(query.pageSize)
      .getManyAndCount();

    return this.utilsService.returnPaging(results, totalItems, query);
  }

  async createProjectIssueCategory(userId: number, projectId: number, params: CreateProjectIssueCategoryDto) {
    return await this.dataSource.transaction(async (transaction) => {
      const projectIssueCategoryRepository = transaction.getRepository(ProjectIssueCategory);

      const firstProjectIssueCurrent = await projectIssueCategoryRepository.findOne({
        where: { projectId, status: ProjectIssueCategoryStatus.ACTIVE, isFirst: true },

        select: ['id', 'order', 'status', 'projectId', 'isFirst', 'isLast'],
      });

      if (firstProjectIssueCurrent?.order) {
        await projectIssueCategoryRepository.update({ id: firstProjectIssueCurrent.id }, { isFirst: false });
        await projectIssueCategoryRepository.insert({
          ...params,
          projectId,
          isFirst: true,
          createdBy: userId,
          order: firstProjectIssueCurrent.order + 1,
        });
      }

      if (!firstProjectIssueCurrent) {
        await projectIssueCategoryRepository.insert({
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

  async detailProjectIssueCategory(userId: number, projectId: number, issueCategoryId: number) {
    return await this.projectIssueCategoryRepository.findOne({
      where: { id: issueCategoryId, projectId, status: ProjectIssueCategoryStatus.ACTIVE },
    });
  }

  async updateProjectIssueCategory(
    userId: number,
    projectId: number,
    {
      projectIssueCategoryId: projectIssueTypeMainId,
      projectIssueCategoryPostId,
      projectIssueCategoryPreId,
      status,
      ...params
    }: UpdateProjectIssueCategoryDto,
  ) {
    return await this.dataSource.transaction(async (transaction) => {
      const projectIssueCategoryRepository = transaction.getRepository(ProjectIssueCategory);

      const result = await this.utilsService.handleLogicUpdateOrder(
        projectIssueTypeMainId,
        projectIssueCategoryPostId,
        projectIssueCategoryPreId,
        projectId,
        status,
        ProjectIssueCategoryStatus.ACTIVE,
        projectIssueCategoryRepository,
        params,
      );
      await this.globalCacheService.delByTypeKey(TypeCacheData.PROJECT_INFORMATION, projectId);
      return result;
    });
  }
}

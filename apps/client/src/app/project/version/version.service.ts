import ProjectVersion from '@app/database-type-orm/entities/task-manager/ProjectVersion';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ListProjectVersionDto } from './dto/list-project-version.dto';
import { ProjectVersionStatus, TypeCacheData } from 'libs/constants/enum';
import { CreateProjectVersionDto } from './dto/create-project-version.dto';
import { UpdateProjectVersionDto } from './dto/update-project-version.dto';
import { GlobalCacheService } from '@app/cache';

@Injectable()
export class VersionService {
  constructor(
    @InjectRepository(ProjectVersion) private readonly projectVersionRepository: Repository<ProjectVersion>,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    private readonly globalCacheService: GlobalCacheService,
  ) {}
  async listProjectVersion(userId: number, projectId: number, query: ListProjectVersionDto) {
    const queryBuilder = this.projectVersionRepository
      .createQueryBuilder('pv')
      .select(['pv.id', 'pv.issueCount', 'pv.name', 'pv.startDate', 'pv.endDate', 'pv.order', 'pv.description'])
      .where('pv.projectId = :projectId AND pv.status = :projectVersionStatusActive', {
        projectId,
        projectVersionStatusActive: ProjectVersionStatus.ACTIVE,
      });

    const [results, totalItems] = await queryBuilder
      .orderBy('pv.order', 'DESC')
      .skip(query.skip)
      .take(query.pageSize)
      .getManyAndCount();

    return this.utilsService.returnPaging(results, totalItems, query);
  }

  async createProjectVersion(userId: number, projectId: number, params: CreateProjectVersionDto) {
    return await this.dataSource.transaction(async (transaction) => {
      const projectVersionRepository = transaction.getRepository(ProjectVersion);

      const firstProjectVersionCurrent = await projectVersionRepository.findOne({
        where: { projectId, status: ProjectVersionStatus.ACTIVE, isFirst: true },
        select: ['id', 'order', 'status', 'projectId', 'isFirst', 'isLast'],
      });

      if (firstProjectVersionCurrent?.order) {
        await projectVersionRepository.update({ id: firstProjectVersionCurrent.id }, { isFirst: false });
        await projectVersionRepository.insert({
          ...params,
          projectId,
          isFirst: true,
          createdBy: userId,
          order: firstProjectVersionCurrent.order + 1,
        });
      }

      if (!firstProjectVersionCurrent) {
        await projectVersionRepository.insert({
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

  async detailProjectVersion(userId: number, projectId: number, versionId: number) {
    return await this.projectVersionRepository.findOne({ where: { id: versionId, projectId } });
  }

  async updateProjectVersionType(
    userId: number,
    projectId: number,
    {
      projectVersionId: projectVersionMainId,
      projectVersionPreId,
      projectVersionPostId,
      status,
      ...params
    }: UpdateProjectVersionDto,
  ) {
    return await this.dataSource.transaction(async (transaction) => {
      const projectVersionRepository = transaction.getRepository(ProjectVersion);

      const result = await this.utilsService.handleLogicUpdateOrder(
        projectVersionMainId,
        projectVersionPostId,
        projectVersionPreId,
        projectId,
        status,
        ProjectVersionStatus.ACTIVE,
        projectVersionRepository,
        params,
      );
      await this.globalCacheService.delByTypeKey(TypeCacheData.PROJECT_INFORMATION, projectId);
      return result;
    });
  }
}

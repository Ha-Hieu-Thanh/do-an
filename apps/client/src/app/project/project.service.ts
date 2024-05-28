import { GlobalCacheService } from '@app/cache';
import { Exception } from '@app/core/exception';
import Project from '@app/database-type-orm/entities/task-manager/Project';
import ProjectIssueCategory from '@app/database-type-orm/entities/task-manager/ProjectIssueCategory';
import ProjectIssueState from '@app/database-type-orm/entities/task-manager/ProjectIssueState';
import ProjectIssueType from '@app/database-type-orm/entities/task-manager/ProjectIssueType';
import ProjectVersion from '@app/database-type-orm/entities/task-manager/ProjectVersion';
import UserProject from '@app/database-type-orm/entities/task-manager/UserProject';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { QueueService } from '@app/queue';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ErrorCustom,
  IssueStatus,
  NotificationContent,
  NotificationRedirectType,
  NotificationTargetType,
  NotificationTitle,
  NotificationType,
  ProjectIssueCategoryStatus,
  ProjectIssueStateStatus,
  ProjectIssueStatesDefault,
  ProjectIssueTypeStatus,
  ProjectIssueTypesDefault,
  ProjectVersionStatus,
  TypeCacheData,
  UserProjectRole,
  UserProjectStatus,
} from 'libs/constants/enum';
import * as moment from 'moment';
import { DataSource, Not, Repository } from 'typeorm';
import { ConfirmRequestJoinProjectDto } from './dto/confirm-request-join-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { GenerateKeyDto } from './dto/generate-key.dto';
import { GetMyProjectsDto } from './dto/get-my-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import UserLeadCategory from '@app/database-type-orm/entities/task-manager/UserLeadCategory';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(UserProject) private readonly userProjectRepository: Repository<UserProject>,
    private readonly dataSource: DataSource,
    private readonly utilsService: UtilsService,
    private readonly globalCacheService: GlobalCacheService,
    private readonly queueService: QueueService,
  ) {}

  async insertProjectItemDefault(
    userId: number,
    projectId: number,
    dataDefault: {
      name: string;
      backgroundColor: string;
      description: string;
      isDefault: boolean;
    }[],
    repository: Repository<ProjectIssueType> | Repository<ProjectIssueState>,
  ) {
    await repository.insert(
      dataDefault.map((item) => ({
        ...item,
        projectId,
        createdBy: userId,
        isDefault: true,
      })),
    );

    return true;
  }

  async generateKey(userId: number, body: GenerateKeyDto) {
    let result = '';
    let pass = true;
    if (body.name) {
      result += `${this.utilsService.capitalizeFirstLetterOfEachWord(body.name)}-`;
    }

    while (pass) {
      result += `${this.utilsService.randomStringNoEnv(2).toUpperCase()}-${moment().utcOffset(420).format('DDMMYYYY')}`;

      const projectDuplicateKey = await this.projectRepository.findOne({ where: { key: result }, select: ['id'] });
      if (!projectDuplicateKey) {
        pass = false;
      }
    }

    return result;
  }

  async createProject(userId: number, { name, key }: CreateProjectDto) {
    return await this.dataSource.transaction(async (transaction) => {
      const projectRepository = transaction.getRepository(Project);
      const projectIssueTypeRepository = transaction.getRepository(ProjectIssueType);
      const projectIssueStateRepository = transaction.getRepository(ProjectIssueState);
      const userProjectRepository = transaction.getRepository(UserProject);
      /* ----------------------- TODO add check count project ----------------------- */
      const countProjectDuplicateKey = await projectRepository.count({ where: { key }, select: ['id'] });

      if (countProjectDuplicateKey) {
        throw new Exception(ErrorCustom.Key_Project_Duplicate);
      }

      const { identifiers: identifiersProject } = await projectRepository.insert(<Project>{
        createdBy: userId,
        name,
        key,
      });
      const projectId = identifiersProject[0].id;

      /* ------------------------- Add Issue types default ------------------------ */
      await this.insertProjectItemDefault(userId, projectId, ProjectIssueTypesDefault, projectIssueTypeRepository);

      /* ------------------------ Add Issue states default ------------------------ */
      await this.insertProjectItemDefault(userId, projectId, ProjectIssueStatesDefault, projectIssueStateRepository);

      await userProjectRepository.insert({ userId, projectId, role: UserProjectRole.PM, createdBy: userId });

      return projectId;
    });
  }

  async updateProject(userId: number, projectId: number, params: UpdateProjectDto) {
    if (params.key) {
      const countProjectDuplicateKey = await this.projectRepository.count({
        where: { key: params.key, id: Not(projectId) },
        select: ['id'],
      });
      if (countProjectDuplicateKey) {
        throw new Exception(ErrorCustom.Key_Project_Duplicate);
      }
    }

    await this.projectRepository.update({ id: projectId }, { ...params, updatedBy: userId });
    await this.globalCacheService.delByTypeKey(TypeCacheData.PROJECT_INFORMATION, projectId);
    return true;
  }

  async getMyProjects(userId: number, query: GetMyProjectsDto) {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('p')
      .innerJoinAndMapOne(
        'p.userProject',
        UserProject,
        'up',
        'up.projectId = p.id AND up.userId = :userId AND up.status IN(:userProjectStatus)',
        {
          userId,
          userProjectStatus: [UserProjectStatus.ACTIVE, UserProjectStatus.PENDING],
        },
      )
      .select([
        'p.id',
        'p.name',
        'p.key',
        'p.avatar',
        'up.userId',
        'up.projectId',
        'up.createdAt',
        'up.role',
        'up.status',
      ]);

    if (query.keyword) {
      queryBuilder.andWhere('(p.name LIKE :keyword OR p.key LIKE :keyword )', { keyword: `%${query.keyword}%` });
    }

    const [results, totalItems] = await queryBuilder
      .addOrderBy('p.id', 'DESC')
      .skip(query.skip)
      .take(query.pageSize)
      .getManyAndCount();

    this.utilsService.assignThumbURLVer2(results, ['avatar']);

    return this.utilsService.returnPaging(results, totalItems, query);
  }

  async detailProject(userId: number, projectId: number) {
    const userProject = await this.userProjectRepository.findOne({
      where: { userId, projectId, status: UserProjectStatus.ACTIVE },
      select: ['userId', 'projectId', 'role'],
    });

    if (!userProject) {
      throw new Exception(ErrorCustom.User_Not_In_Project);
    }

    const project = await this.projectRepository
      .createQueryBuilder('p')
      .leftJoinAndMapOne('p.userProject', UserProject, 'up', 'up.projectId = p.id AND up.userId = :userId', {
        userId,
      })
      .leftJoinAndMapMany('up.categoryIds', UserLeadCategory, 'ulc', 'ulc.userProjectId = up.id')
      .leftJoinAndMapMany(
        'p.projectIssueTypes',
        ProjectIssueType,
        'pit',
        'pit.projectId = p.id AND pit.status = :projectIssueTypeStatusActive',
        { projectIssueTypeStatusActive: ProjectIssueTypeStatus.ACTIVE },
      )
      .leftJoinAndMapMany(
        'p.projectIssueStates',
        ProjectIssueState,
        'pis',
        'pis.projectId = p.id AND pis.status = :projectIssueStateStatusActive',
        { projectIssueStateStatusActive: ProjectIssueStateStatus.ACTIVE },
      )
      .leftJoinAndMapMany(
        'p.projectIssueCategories',
        ProjectIssueCategory,
        'pic',
        'pic.projectId = p.id AND pic.status = :projectIssueCategoryStatusActive',
        { projectIssueCategoryStatusActive: ProjectIssueCategoryStatus.ACTIVE },
      )
      .leftJoinAndMapMany(
        'p.projectVersions',
        ProjectVersion,
        'pv',
        'pv.projectId = p.id AND pv.status = :projectVersionStatusActive',
        { projectVersionStatusActive: ProjectVersionStatus.ACTIVE },
      )
      .where('p.id = :projectId', { projectId })
      .select([
        'p.id',
        'p.name',
        'p.key',
        'p.avatar',
        'p.memberCount',
        'p.issueCount',
        'pit.id',
        'pit.name',
        'pit.backgroundColor',
        'pit.issueCount',
        'pis.id',
        'pis.name',
        'pis.backgroundColor',
        'pis.issueCount',
        'pic.id',
        'pic.name',
        'pic.issueCount',
        'pv.id',
        'pv.name',
        'pv.issueCount',
        'up.userId',
        'up.projectId',
        'up.createdAt',
        'up.role',
        'up.status',
        'ulc.categoryId',
      ])
      .orderBy('pit.order', 'DESC')
      .addOrderBy('pis.order', 'DESC')
      .addOrderBy('pic.order', 'DESC')
      .addOrderBy('pv.order', 'DESC')
      .getOne();

    const totalIssueCategoriesByState = await this.dataSource.query(
      `
          SELECT i.category_id categoryId, i.state_id stateId, COUNT(1) total
          FROM issue i 
          WHERE 
            i.project_id = ${projectId} AND
            i.status = ${IssueStatus.ACTIVE}
          GROUP BY i.category_id, i.state_id
        `,
    );

    const totalIssueVersionsByState = await this.dataSource.query(
      `
        SELECT i.version_id versionId, i.state_id stateId, COUNT(1) total
        FROM issue i 
        WHERE 
          i.project_id = ${projectId} AND
          i.status = ${IssueStatus.ACTIVE}
        GROUP BY i.version_id, i.state_id
      `,
    );

    const totalIssueCategoriesByStateFormat = totalIssueCategoriesByState.reduce((acc, cur) => {
      const categoryId = cur.categoryId ? cur.categoryId : -1;
      if (!acc[categoryId]) acc[categoryId] = [];
      acc[categoryId].push(cur);
      return acc;
    }, {});

    const totalIssueVersionsByStateFormat = totalIssueVersionsByState.reduce((acc, cur) => {
      const versionId = cur.versionId ? cur.versionId : -1;
      if (!acc[versionId]) acc[versionId] = [];
      acc[versionId].push(cur);
      return acc;
    }, {});

    const projectIssueCategories = project?.projectIssueCategories.reduce((acc, cur) => {
      if (totalIssueCategoriesByStateFormat[cur.id]) {
        acc.push({
          ...cur,
          byState: totalIssueCategoriesByStateFormat[cur.id].reduce((acc, cur) => {
            acc[cur.stateId] = cur.total;
            return acc;
          }, {}),
        });
      } else {
        acc.push({
          ...cur,
          byState: null,
        });
      }
      return acc;
    }, [] as any[]);

    const projectVersions = project?.projectVersions.reduce((acc, cur) => {
      if (totalIssueVersionsByStateFormat[cur.id]) {
        acc.push({
          ...cur,
          byState: totalIssueVersionsByStateFormat[cur.id].reduce((acc, cur) => {
            acc[cur.stateId] = cur.total;
            return acc;
          }, {}),
        });
      } else {
        acc.push({
          ...cur,
          byState: null,
        });
      }
      return acc;
    }, [] as any[]);

    if (totalIssueCategoriesByStateFormat[-1]) {
      projectIssueCategories?.push({
        id: -1,
        name: 'No category',
        ...totalIssueCategoriesByStateFormat[-1].reduce(
          (acc, cur) => {
            acc.byState[cur.stateId] = cur.total;
            acc.issueCount += cur.total;
            return acc;
          },
          { byState: {}, issueCount: 0 },
        ),
      });
    }
    if (totalIssueVersionsByStateFormat[-1]) {
      projectVersions?.push({
        id: -1,
        name: 'No Version',
        ...totalIssueVersionsByStateFormat[-1].reduce(
          (acc, cur) => {
            acc.byState[cur.stateId] = cur.total;
            acc.issueCount += cur.total;
            return acc;
          },
          { byState: {}, issueCount: 0 },
        ),
      });
    }

    (project as any).userProject.categoryIds = (project as any).userProject.categoryIds.map(
      (item: { categoryId: number }) => item.categoryId,
    );

    this.utilsService.assignThumbURLVer2(project, ['avatar']);

    const data = { ...project, projectIssueCategories, projectVersions };

    return data;
  }

  async confirmRequestJoinProject(userId: number, { status, projectId }: ConfirmRequestJoinProjectDto) {
    return await this.dataSource.transaction(async (transaction) => {
      const userProjectRepository = transaction.getRepository(UserProject);
      const projectRepository = transaction.getRepository(Project);
      const user = await this.globalCacheService.getUserInfo(userId);
      const project = await projectRepository.findOne({ where: { id: projectId }, select: ['id', 'key', 'name'] });
      const userProject = await userProjectRepository.findOne({
        where: { userId, projectId, status: UserProjectStatus.PENDING },
        select: ['userId', 'projectId'],
      });

      if (!userProject) {
        throw new Exception(ErrorCustom.User_Not_Pending_Request_Join_Project);
      }

      const task: (() => void)[] = [];

      task.push(() =>
        userProjectRepository.update({ userId, projectId, status: UserProjectStatus.PENDING }, { status }),
      );

      if (status === UserProjectStatus.ACTIVE) {
        task.push(() => projectRepository.update({ id: projectId }, { memberCount: () => `member_count + 1` }));
      }

      await Promise.all(task.map((item) => item()));
      await this.globalCacheService.delByTypeKey(TypeCacheData.PROJECT_INFORMATION, projectId);

      if (status === UserProjectStatus.ACTIVE) {
        this.queueService.addNotification({
          receiversId: [],
          type: NotificationType.Confirm_Invite_To_The_Project,
          title: NotificationTitle.Confirm_Invite_To_The_Project,
          content: NotificationContent.Confirm_Invite_To_The_Project,
          targetType: NotificationTargetType.PROJECT,
          createdBy: userId,
          targetId: projectId,
          redirectType: NotificationRedirectType.PROJECT_SETTING_MEMBER,
          redirectId: projectId,
          metadata: {
            userName: user.name,
            projectKey: project?.key,
            projectName: project?.name,
          },
        });
      }
      if (status === UserProjectStatus.REJECT) {
        this.queueService.addNotification({
          receiversId: [],
          type: NotificationType.Reject_Invite_To_The_Project,
          title: NotificationTitle.Reject_Invite_To_The_Project,
          content: NotificationContent.Reject_Invite_To_The_Project,
          targetType: NotificationTargetType.PROJECT,
          createdBy: userId,
          targetId: projectId,
          redirectType: NotificationRedirectType.PROJECT_SETTING_MEMBER,
          redirectId: projectId,
          metadata: {
            userName: user.name,
            projectKey: project?.key,
            projectName: project?.name,
          },
        });
      }

      return true;
    });
  }
}

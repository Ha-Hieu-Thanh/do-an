import { Injectable } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { Between, DataSource, LessThan, LessThanOrEqual, MoreThan, Not, Repository } from 'typeorm';
import Issue from '@app/database-type-orm/entities/task-manager/Issue';
import { GlobalCacheService } from '@app/cache';
import { Exception } from '@app/core/exception';
import {
  ErrorCustom,
  IssueHistoryType,
  IssueStatus,
  NotificationContent,
  NotificationRedirectType,
  NotificationTargetType,
  NotificationTitle,
  NotificationType,
  UserProjectRole,
  UserProjectStatus,
  UserRole,
} from 'libs/constants/enum';
import UserProject from '@app/database-type-orm/entities/task-manager/UserProject';
import ProjectIssueCategory from '@app/database-type-orm/entities/task-manager/ProjectIssueCategory';
import ProjectIssueState from '@app/database-type-orm/entities/task-manager/ProjectIssueState';
import ProjectIssueType from '@app/database-type-orm/entities/task-manager/ProjectIssueType';
import ProjectVersion from '@app/database-type-orm/entities/task-manager/ProjectVersion';
import { ListProjectIssueDto } from './dto/list-project-issue.dto';
import User from '@app/database-type-orm/entities/task-manager/User';
import Project from '@app/database-type-orm/entities/task-manager/Project';
import { UpdateIssueDto } from './dto/update-issue.dto';
import IssueHistory from '@app/database-type-orm/entities/task-manager/IssueHistory';
import { ListProjectIssueHistoryDto } from './dto/list-project-issue-history.dto';
import { QueueService } from '@app/queue';
import UserLeadCategory from '@app/database-type-orm/entities/task-manager/UserLeadCategory';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue) private readonly issueRepository: Repository<Issue>,
    @InjectRepository(IssueHistory) private readonly issueHistoryRepository: Repository<IssueHistory>,
    @InjectRepository(UserProject) private readonly userProjectRepository: Repository<UserProject>,
    @InjectRepository(ProjectIssueState) private readonly projectIssueStateRepository: Repository<ProjectIssueState>,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    private readonly globalCacheService: GlobalCacheService,
    private readonly queueService: QueueService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async listProjectIssue(userId: number, query: ListProjectIssueDto, projectId: number) {
    const queryBuilder = this.issueRepository
      .createQueryBuilder('i')
      .leftJoinAndMapOne('i.projectIssueState', ProjectIssueState, 'pis', 'pis.id = i.stateId')
      .leftJoinAndMapOne('i.projectIssueType', ProjectIssueType, 'pit', 'pit.id = i.typeId')
      .leftJoinAndMapOne('i.projectIssueCategory', ProjectIssueCategory, 'pic', 'pic.id = i.categoryId')
      .leftJoinAndMapOne('i.projectVersion', ProjectVersion, 'pv', 'pv.id = i.versionId')
      .leftJoinAndMapOne('i.assignee', User, 'u', 'u.id = i.assigneeId')
      .leftJoinAndMapOne('i.created', User, 'uc', 'uc.id = i.createdBy')
      .innerJoinAndMapOne('i.project', Project, 'p', 'p.id = i.projectId')

      .select([
        'i.id',
        'i.subject',
        'i.priority',
        'i.startDate',
        'i.dueDate',
        'i.estimatedHours',
        'i.actualHours',
        'i.order',
        'i.stateId',
        'i.projectId',
        'i.createdAt',
        'i.updatedAt',
        'i.createdBy',
        'i.assigneeId',
        'u.id',
        'u.name',
        'u.avatar',
        'uc.id',
        'uc.name',
        'uc.avatar',
        'pit.id',
        'pit.name',
        'pit.backgroundColor',
        'pic.id',
        'pic.name',
        'pis.id',
        'pis.name',
        'pis.backgroundColor',
        'pv.id',
        'pv.name',
        'p.id',
        'p.name',
        'p.key',
      ])
      .where('i.projectId = :projectId AND i.status = :IssueStatusActive', {
        projectId,
        IssueStatusActive: IssueStatus.ACTIVE,
      });

    if (query.keyword) {
      queryBuilder.andWhere('i.subject LIKE :keyword', { keyword: `%${query.keyword}%` });
    }
    if (query.assigneeId) {
      queryBuilder.andWhere('i.assigneeId = :assigneeId', { assigneeId: query.assigneeId });
    }
    if (query.categoryId) {
      queryBuilder.andWhere('i.categoryId = :categoryId', { categoryId: query.categoryId });
    }
    if (query.stateIds?.length) {
      queryBuilder.andWhere('i.stateId IN(:stateIds)', { stateIds: query.stateIds });
    }
    if (query.typeId) {
      queryBuilder.andWhere('i.typeId = :typeId', { typeId: query.typeId });
    }
    if (query.versionId) {
      queryBuilder.andWhere('i.versionId = :versionId', { versionId: query.versionId });
    }
    if (query.sortField) {
      queryBuilder.orderBy(`i.${query.sortField}`, 'DESC');
    }
    if (query.isGetAll) {
      queryBuilder.addOrderBy('i.id', 'DESC');
    } else {
      queryBuilder.addOrderBy('i.order', 'DESC');
    }
    if (query.isCreated) {
      queryBuilder.andWhere('i.createdBy = :userId', { userId });
    }

    const [results, totalItems] = await queryBuilder.skip(query.skip).take(query.pageSize).getManyAndCount();

    this.utilsService.assignThumbURLVer2(results, ['assignee', 'avatar']);
    this.utilsService.assignThumbURLVer2(results, ['created', 'avatar']);

    return this.utilsService.returnPaging(results, totalItems, query);
  }

  async listGanttChartIssue(userId: number, query: ListProjectIssueDto, projectId: number) {
    const queryBuilder = this.userProjectRepository
      .createQueryBuilder('up')
      .innerJoinAndMapOne('up.user', User, 'u', 'u.id = up.userId')
      .leftJoinAndMapMany(
        'up.issues',
        Issue,
        'i',
        'i.assigneeId = up.userId AND i.projectId = up.projectId AND i.startDate IS NOT NULL AND i.dueDate IS NOT NULL',
      )
      .select([
        'up.userId',
        'up.issueCount',
        'u.name',
        'u.avatar',
        'i.id',
        'i.subject',
        'i.startDate',
        'i.dueDate',
        'i.stateId',
      ])
      .where('up.projectId = :projectId', { projectId });

    const states = await this.projectIssueStateRepository.find({
      where: { projectId },
      select: ['id', 'name', 'backgroundColor'],
    });

    const results = await queryBuilder.getMany();
    this.utilsService.assignThumbURLVer2(results, ['user', 'avatar']);

    return {
      results,
      states: states.reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      }, {}),
    };
  }

  async createIssue(userId: number, params: CreateIssueDto, projectId: number) {
    const projectInfo = await this.validateDataIdCoreIssue(projectId, {
      assigneeId: params.assigneeId,
      categoryId: params.categoryId,
      versionId: params.versionId,
      typeId: params.typeId,
    });

    const user = await this.globalCacheService.getUserInfo(userId);

    return await this.dataSource.transaction(async (transaction) => {
      const issueRepository = transaction.getRepository(Issue);
      const userProjectRepository = transaction.getRepository(UserProject);
      const projectRepository = transaction.getRepository(Project);
      const projectIssueCategoryRepository = transaction.getRepository(ProjectIssueCategory);
      const projectIssueStateRepository = transaction.getRepository(ProjectIssueState);
      const projectIssueTypeRepository = transaction.getRepository(ProjectIssueType);
      const projectVersionRepository = transaction.getRepository(ProjectVersion);
      const issueHistoryRepository = transaction.getRepository(IssueHistory);

      const stateIdDefault = projectInfo.projectIssueState[0];
      const task: (() => void)[] = [];

      const { identifiers: identifiersProject } = await issueRepository.insert({
        ...params,
        projectId,
        createdBy: userId,
        stateId: stateIdDefault,
        order: () =>
          `(SELECT COUNT(1) FROM issue i WHERE i.status = ${IssueStatus.ACTIVE} AND i.state_id = ${stateIdDefault}) + 1`,
      });
      const issueId = identifiersProject[0].id;

      task.push(() => {
        userProjectRepository.update({ userId: params.assigneeId, projectId }, { issueCount: () => `issue_count + 1` });
        projectIssueStateRepository.update({ id: stateIdDefault }, { issueCount: () => `issue_count + 1` });
        projectRepository.update({ id: projectId }, { issueCount: () => `issue_count + 1` });
        issueHistoryRepository.insert({
          issueId,
          projectId,
          createdBy: userId,
          type: IssueHistoryType.CREATE,
          metadata: JSON.stringify({
            dataNew: this.utilsService.pickObject(params, ['subject', 'description', 'assigneeId']),
          }),
        });
      });

      if (params.typeId) {
        task.push(() =>
          projectIssueTypeRepository.update({ id: params.typeId }, { issueCount: () => `issue_count + 1` }),
        );
      }
      if (params.categoryId) {
        task.push(() =>
          projectIssueCategoryRepository.update({ id: params.categoryId }, { issueCount: () => `issue_count + 1` }),
        );
      }
      if (params.versionId) {
        task.push(() =>
          projectVersionRepository.update({ id: params.versionId }, { issueCount: () => `issue_count + 1` }),
        );
      }
      if (params.assigneeId && params.assigneeId !== userId) {
        task.push(() =>
          this.queueService.addNotification({
            receiversId: [params.assigneeId],
            type: NotificationType.Assignee_To_The_Issue,
            title: NotificationTitle.Assignee_To_The_Issue,
            content: NotificationContent.Assignee_To_The_Issue,
            targetType: NotificationTargetType.CLIENT,
            createdBy: userId,
            redirectId: projectId,
            redirectType: NotificationRedirectType.PROJECT_ISSUE,
            targetId: issueId,
            metadata: {
              userName: user.name,
              projectKey: projectInfo.key,
              issueId: issueId,
              issueSubject: params.subject,
            },
          }),
        );
      }

      await Promise.all(task.map((item) => item()));

      if (params.dueDate) {
        const deadlineTime = new Date(params.dueDate).getTime();
        const timeNow = new Date().getTime();
        const issue = await issueRepository.findOne({
          where: { id: issueId, status: IssueStatus.ACTIVE, projectId },
          select: ['id', 'status', 'dueDate', 'assigneeId'],
        });

        if (!issue) return;
        // for each key of projectInfo.userProjectByUserId, check if role is PM , then add to listPMIds
        const listPMAndSubPMIds = Object.keys(projectInfo.userProjectByUserId)
          .filter((key) => [UserProjectRole.PM].includes(projectInfo.userProjectByUserId[key].role))
          .map(Number);

        if (params.categoryId) {
          const listSubPMLeadCategory = (await transaction
            .createQueryBuilder(UserLeadCategory, 'ulc')
            .innerJoin(UserProject, 'up', 'ulc.userProjectId = up.id')
            .where('ulc.categoryId = :categoryId', { categoryId: params.categoryId })
            .select('up.userId')
            .getRawMany()) as number[];

          listPMAndSubPMIds.push(...listSubPMLeadCategory);
        }

        if (deadlineTime - timeNow - 1000 * 60 * 10 >= 0) {
          const timeout = setTimeout(async () => {
            this.queueService.addNotification({
              receiversId: [issue.assigneeId],
              type: NotificationType.Task_Deadline,
              title: NotificationTitle.Task_Deadline,
              content: NotificationContent.Task_Deadline,
              targetType: NotificationTargetType.CLIENT,
              createdBy: userId,
              targetId: issueId,
              redirectType: NotificationRedirectType.PROJECT_ISSUE,
              redirectId: projectId,
              metadata: {
                userName: user.name,
                projectKey: projectInfo.key,
                issueId,
                issueSubject: params.subject,
              },
            });
          }, deadlineTime - timeNow - 1000 * 60 * 10);
          this.schedulerRegistry.addTimeout(`issue_${issueId}`, timeout);
        }
        const assignee = await this.globalCacheService.getUserInfo(issue.assigneeId);

        const timeoutOnTime = setTimeout(async () => {
          this.queueService.addNotification({
            // delete duplication ids
            receiversId: [...new Set([issue.assigneeId, ...listPMAndSubPMIds])],
            type: NotificationType.Task_Deadline,
            title: NotificationTitle.Task_Deadline_On_Time,
            content: NotificationContent.Task_Deadline_On_Time,
            targetType: NotificationTargetType.CLIENT,
            createdBy: userId,
            targetId: issueId,
            redirectType: NotificationRedirectType.PROJECT_ISSUE,
            redirectId: projectId,
            metadata: {
              userName: assignee.name,
              projectKey: projectInfo.key,
              issueId,
              issueSubject: params.subject,
            },
          });
        }, deadlineTime - timeNow);

        this.schedulerRegistry.addTimeout(`issue_on_time_${issueId}`, timeoutOnTime);
      }
      return true;
    });
  }

  async validateDataIdCoreIssue(
    projectId: number,
    {
      typeId,
      assigneeId,
      categoryId,
      versionId,
    }: { typeId?: number; assigneeId?: number; categoryId?: number; versionId?: number },
  ) {
    const projectInfo = await this.globalCacheService.getProjectInfo(projectId);
    if (assigneeId && !projectInfo.userProjectByUserId[assigneeId]) {
      throw new Exception(ErrorCustom.User_Assignee_Not_In_Project);
    }
    if (assigneeId && projectInfo.userProjectByUserId[assigneeId].status !== UserProjectStatus.ACTIVE) {
      throw new Exception(ErrorCustom.User_Assignee_In_Project_Not_Active);
    }
    if (typeId && !projectInfo.projectIssueType.includes(typeId)) {
      throw new Exception(ErrorCustom.Issue_Type_Invalid_Input);
    }
    if (categoryId && !projectInfo.projectIssueCategory.includes(categoryId)) {
      throw new Exception(ErrorCustom.Issue_Category_Invalid_Input);
    }
    if (versionId && !projectInfo.projectVersion.includes(versionId)) {
      throw new Exception(ErrorCustom.Project_Version_Invalid_Input);
    }

    return projectInfo;
  }

  async detailProjectIssue(userId: number, projectId: number, issueId: number) {
    const issue = await this.issueRepository
      .createQueryBuilder('i')
      .leftJoinAndMapOne('i.type', ProjectIssueType, 'pit', 'pit.id = i.typeId')
      .leftJoinAndMapOne('i.state', ProjectIssueState, 'pis', 'pis.id = i.stateId')
      .leftJoinAndMapOne('i.assignee', User, 'ua', 'ua.id = i.assigneeId')
      .leftJoinAndMapOne('i.category', ProjectIssueCategory, 'pic', 'pic.id = i.categoryId')
      .leftJoinAndMapOne('i.version', ProjectVersion, 'pv', 'pv.id = i.versionId')
      .innerJoinAndMapOne('i.created', User, 'uc', 'uc.id = i.createdBy')
      .select([
        'i.id',
        'i.subject',
        'i.order',
        'i.description',
        'i.status',
        'i.priority',
        'i.startDate',
        'i.dueDate',
        'i.estimatedHours',
        'i.actualHours',
        'i.typeId',
        'i.stateId',
        'i.assigneeId',
        'i.versionId',
        'i.categoryId',
        'i.createdAt',
        'i.createdBy',
        'pit.id',
        'pit.name',
        'pit.backgroundColor',
        'pis.id',
        'pis.name',
        'pis.backgroundColor',
        'ua.id',
        'ua.name',
        'ua.avatar',
        'uc.id',
        'uc.name',
        'uc.avatar',
        'pic.id',
        'pic.name',
        'pv.id',
        'pv.name',
      ])
      .where('i.id = :issueId AND i.projectId = :projectId', { issueId, projectId })
      .getOne();

    this.utilsService.assignThumbURLVer2(issue, ['assignee', 'avatar']);
    this.utilsService.assignThumbURLVer2(issue, ['created', 'avatar']);

    return issue;
  }

  async updateProjectIssue(
    userId: number,
    projectId: number,
    userProjectRole: UserProjectRole,
    issueId: number,
    params: UpdateIssueDto,
  ) {
    const issueCurrent = await this.detailProjectIssue(userId, projectId, issueId);
    if (!issueCurrent) {
      throw new Exception(ErrorCustom.Invalid_Input);
    }

    const user = await this.globalCacheService.getUserInfo(userId);
    // TODO: handle category by sub_pm lead ( join table )

    let userProjectCategoryIds;
    let userProjectCategoryIdsList;

    if (UserRole.USER === user?.role) {
      userProjectCategoryIds = await this.userProjectRepository
        .createQueryBuilder('up')
        .innerJoin(UserLeadCategory, 'ulc', 'ulc.userProjectId = up.id')
        .where('up.projectId = :projectId AND up.userId = :userId AND up.status = :userProjectStatusActive', {
          projectId,
          userId,
          userProjectStatusActive: UserProjectStatus.ACTIVE,
        })
        .select('ulc.categoryId', 'categoryId')
        .getRawMany();

      userProjectCategoryIdsList = userProjectCategoryIds.map((item) => item.categoryId);
    }
    const isPermission =
      [UserRole.ADMIN].includes(user?.role) ||
      ([UserProjectRole.SUB_PM].includes(userProjectRole) &&
        userProjectCategoryIdsList.includes(issueCurrent.categoryId)) ||
      [UserProjectRole.PM].includes(userProjectRole) ||
      issueCurrent.createdBy === userId ||
      issueCurrent.assigneeId === userId;

    if (!isPermission) {
      throw new Exception(ErrorCustom.User_Not_Permission_Update_Issue);
    }

    const projectInfo = await this.validateDataIdCoreIssue(projectId, {
      assigneeId: params.assigneeId,
      categoryId: params.categoryId,
      versionId: params.versionId,
      typeId: params.typeId,
    });

    return await this.dataSource.transaction(async (transaction) => {
      const { issuePostId, ...data } = params;
      const issueRepository = transaction.getRepository(Issue);
      const userProjectRepository = transaction.getRepository(UserProject);
      const projectIssueCategoryRepository = transaction.getRepository(ProjectIssueCategory);
      const projectIssueStateRepository = transaction.getRepository(ProjectIssueState);
      const projectIssueTypeRepository = transaction.getRepository(ProjectIssueType);
      const projectVersionRepository = transaction.getRepository(ProjectVersion);
      const issueHistoryRepository = transaction.getRepository(IssueHistory);

      const startDate = data.startDate || issueCurrent?.startDate;
      const dueDate = data.dueDate || issueCurrent?.dueDate;
      if (startDate && dueDate && startDate > dueDate) {
        throw new Exception(ErrorCustom.Invalid_Input_Date_Issue);
      }

      const task: (() => void)[] = [];
      const dataCurrent = {};
      const dataNew = {};

      Object.keys(data).forEach((key) => {
        if (data[key] !== issueCurrent[key]) {
          const keyConvert = this.utilsService.handleTextKeyUpdateIssue(key);
          Object.assign(dataCurrent, {
            [keyConvert]: this.utilsService.handleTextByKeyUpdateIssue(projectInfo, key, issueCurrent[key]),
          });
          Object.assign(dataNew, {
            [keyConvert]: this.utilsService.handleTextByKeyUpdateIssue(projectInfo, key, data[key]),
          });
        }
      });

      if (data.typeId && data.typeId !== issueCurrent?.typeId) {
        task.push(() => {
          projectIssueTypeRepository.update({ id: data.typeId }, { issueCount: () => `issue_count + 1` });
          projectIssueTypeRepository.update({ id: issueCurrent?.typeId }, { issueCount: () => `issue_count - 1` });
        });
      }
      if (data.stateId && data.stateId !== issueCurrent?.stateId) {
        task.push(() => {
          projectIssueStateRepository.update({ id: data.stateId }, { issueCount: () => `issue_count + 1` });
          projectIssueStateRepository.update({ id: issueCurrent?.stateId }, { issueCount: () => `issue_count - 1` });
          issueRepository.update(
            {
              order: MoreThan(issueCurrent.order),
              id: Not(issueId),
              stateId: issueCurrent?.stateId,
              status: IssueStatus.ACTIVE,
            },
            { order: () => `order - 1` },
          );
        });

        if (issuePostId && issuePostId !== -1) {
          const checkIssuePost = await issueRepository.findOne({
            where: { id: issuePostId, status: IssueStatus.ACTIVE, projectId },
            select: ['id', 'status', 'order', 'stateId'],
          });

          if (!checkIssuePost || checkIssuePost.stateId !== data.stateId) {
            throw new Exception(ErrorCustom.Invalid_Input_Issue_Post_Id);
          }

          Object.assign(data, {
            order: checkIssuePost.order,
          });

          task.push(() => {
            issueRepository
              .createQueryBuilder('i')
              .update()
              .set({ order: () => `order + 1` })
              .where([
                {
                  order: MoreThan(issueCurrent.order),
                  id: Not(issueId),
                  stateId: issueCurrent?.stateId,
                  status: IssueStatus.ACTIVE,
                },
                { id: issuePostId },
              ])
              .execute();
          });
        }
        if (!issuePostId || issuePostId === -1) {
          Object.assign(data, {
            order: () => `(SELECT pis.issue_count FROM project_issue_state pis WHERE pis.id = ${data.stateId}) + 1`,
          });
        }
      }
      if ((!data.stateId || data.stateId === issueCurrent?.stateId) && issuePostId) {
        if (issuePostId !== -1) {
          const checkIssuePost = await issueRepository.findOne({
            where: { id: issuePostId, status: IssueStatus.ACTIVE, projectId },
            select: ['id', 'status', 'order', 'stateId'],
          });

          if (!checkIssuePost || checkIssuePost.stateId !== issueCurrent.stateId) {
            throw new Exception(ErrorCustom.Invalid_Input_Issue_Post_Id);
          }

          if (issueCurrent.order > checkIssuePost.order) {
            Object.assign(data, {
              order: checkIssuePost.order,
            });
            task.push(() => {
              issueRepository
                .createQueryBuilder('i')
                .update()
                .set({ order: () => `order + 1` })
                .where([
                  {
                    order: Between(checkIssuePost.order, issueCurrent.order - 1),
                    id: Not(issueId),
                    stateId: issueCurrent?.stateId,
                    status: IssueStatus.ACTIVE,
                  },
                ])
                .execute();
            });
          } else {
            Object.assign(data, {
              order: checkIssuePost.order - 1,
            });
            task.push(() => {
              issueRepository
                .createQueryBuilder('i')
                .update()
                .set({ order: () => `order - 1` })
                .where([
                  {
                    order: Between(issueCurrent.order + 1, checkIssuePost.order - 1),
                    id: Not(issueId),
                    stateId: issueCurrent?.stateId,
                    status: IssueStatus.ACTIVE,
                  },
                ])
                .execute();
            });
          }
        }

        if (issuePostId === -1) {
          Object.assign(data, {
            order: () =>
              `(SELECT pis.issue_count FROM project_issue_state pis WHERE pis.id = ${issueCurrent?.stateId})`,
          });
          task.push(() => {
            issueRepository
              .createQueryBuilder('i')
              .update()
              .set({ order: () => `order - 1` })
              .where([
                {
                  id: Not(issueId),
                  order: MoreThan(issueCurrent.order),
                  stateId: issueCurrent?.stateId,
                  status: IssueStatus.ACTIVE,
                },
              ])
              .execute();
          });
        }
      }
      if (data.assigneeId && data.assigneeId !== issueCurrent?.assigneeId) {
        task.push(() => {
          userProjectRepository.update({ userId: data.assigneeId, projectId }, { issueCount: () => `issue_count + 1` });
          userProjectRepository.update(
            { userId: issueCurrent?.assigneeId, projectId },
            { issueCount: () => `issue_count - 1` },
          );
        });
        if (data.assigneeId !== userId) {
          task.push(() =>
            this.queueService.addNotification({
              receiversId: [data.assigneeId],
              type: NotificationType.Assignee_To_The_Issue,
              title: NotificationTitle.Assignee_To_The_Issue,
              content: NotificationContent.Assignee_To_The_Issue,
              targetType: NotificationTargetType.CLIENT,
              createdBy: userId,
              redirectId: projectId,
              redirectType: NotificationRedirectType.PROJECT_BOARD,
              metadata: {
                userName: user.name,
                projectKey: projectInfo.key,
                issueId: issueId,
                issueSubject: data.subject || issueCurrent.subject,
              },
            }),
          );
        }
      }
      if (data.versionId && data.versionId !== issueCurrent?.versionId) {
        task.push(() => {
          projectVersionRepository.update({ id: data.versionId }, { issueCount: () => `issue_count + 1` });
          projectVersionRepository.update({ id: issueCurrent?.versionId }, { issueCount: () => `issue_count - 1` });
        });
      }
      if (data.categoryId && data.categoryId !== issueCurrent?.categoryId) {
        task.push(() => {
          projectIssueCategoryRepository.update({ id: data.categoryId }, { issueCount: () => `issue_count + 1` });
          projectIssueCategoryRepository.update(
            { id: issueCurrent?.categoryId },
            { issueCount: () => `issue_count - 1` },
          );
        });
      }

      await issueRepository.update({ id: issueId }, data);

      task.push(() => {
        if (Object.keys(dataNew).length) {
          issueHistoryRepository.insert({
            issueId,
            projectId,
            createdBy: userId,
            type: IssueHistoryType.UPDATE,
            metadata: JSON.stringify({
              dataCurrent,
              dataNew,
            }),
          });
        }
      });

      await Promise.all(task.map((item) => item()));

      // clear old time out and set new time out
      if (params.dueDate) {
        const deadlineTime = new Date(params.dueDate).getTime();
        const timeNow = new Date().getTime();
        const issue = await issueRepository.findOne({
          where: { id: issueId, status: IssueStatus.ACTIVE, projectId },
          select: ['id', 'status', 'dueDate', 'assigneeId'],
        });

        if (!issue) return;
        const listPMAndSubPMIds = Object.keys(projectInfo.userProjectByUserId)
          .filter((key) => [UserProjectRole.PM].includes(projectInfo.userProjectByUserId[key].role))
          .map(Number);

        if (params.categoryId) {
          const listSubPMLeadCategory = (await transaction
            .createQueryBuilder(UserLeadCategory, 'ulc')
            .innerJoin(UserProject, 'up', 'ulc.userProjectId = up.id')
            .where('ulc.categoryId = :categoryId', { categoryId: params.categoryId })
            .select('up.userId')
            .getRawMany()) as number[];

          listPMAndSubPMIds.push(...listSubPMLeadCategory);
        }

        if (deadlineTime - timeNow - 1000 * 60 * 10 >= 0) {
          const timeout = setTimeout(async () => {
            this.queueService.addNotification({
              receiversId: [issue.assigneeId],
              type: NotificationType.Task_Deadline,
              title: NotificationTitle.Task_Deadline,
              content: NotificationContent.Task_Deadline,
              targetType: NotificationTargetType.CLIENT,
              createdBy: userId,
              targetId: issueId,
              redirectType: NotificationRedirectType.PROJECT_ISSUE,
              redirectId: projectId,
              metadata: {
                userName: user.name,
                projectKey: projectInfo.key,
                issueId,
                issueSubject: params.subject,
              },
            });
          }, deadlineTime - timeNow - 1000 * 60 * 10);
          if (this.schedulerRegistry.doesExist('timeout', `issue_${issueId}`)) {
            this.schedulerRegistry.deleteTimeout(`issue_${issueId}`);
          }
          this.schedulerRegistry.addTimeout(`issue_${issueId}`, timeout);
        }
        const assignee = await this.globalCacheService.getUserInfo(issue.assigneeId);

        const timeoutOnTime = setTimeout(async () => {
          this.queueService.addNotification({
            // delete duplication ids
            receiversId: [...new Set([issue.assigneeId, ...listPMAndSubPMIds])],
            type: NotificationType.Task_Deadline,
            title: NotificationTitle.Task_Deadline_On_Time,
            content: NotificationContent.Task_Deadline_On_Time,
            targetType: NotificationTargetType.CLIENT,
            createdBy: userId,
            targetId: issueId,
            redirectType: NotificationRedirectType.PROJECT_ISSUE,
            redirectId: projectId,
            metadata: {
              userName: assignee.name,
              projectKey: projectInfo.key,
              issueId,
              issueSubject: params.subject,
            },
          });
        }, deadlineTime - timeNow);
        if (this.schedulerRegistry.doesExist('timeout', `issue_on_time_${issueId}`)) {
          this.schedulerRegistry.deleteTimeout(`issue_on_time_${issueId}`);
        }
        this.schedulerRegistry.addTimeout(`issue_on_time_${issueId}`, timeoutOnTime);
      }

      return true;
    });
  }

  // TODO: change to get history from elasticsearch
  async listProjectIssueHistory(userId: number, query: ListProjectIssueHistoryDto, projectId: number) {
    const queryBuilder = this.issueHistoryRepository
      .createQueryBuilder('ih')
      .innerJoinAndMapOne('ih.created', User, 'u', 'u.id = ih.createdBy')
      // .innerJoinAndMapOne(
      //   'ih.userProject',
      //   UserProject,
      //   'up',
      //   'up.projectId = ih.projectId AND up.userId = :userId AND up.status = :userProjectStatusActive',
      //   {
      //     userId,
      //     userProjectStatusActive: UserProjectStatus.ACTIVE,
      //   },
      // )
      .innerJoinAndMapOne('ih.project', Project, 'p', 'p.id = ih.projectId')
      .select([
        'ih.id',
        'ih.issueId',
        'ih.projectId',
        'ih.metadata',
        'ih.type',
        'ih.createdAt',
        'u.id',
        'u.name',
        'u.avatar',
        'p.id',
        'p.name',
        'p.key',
      ]);

    if (projectId) {
      queryBuilder.andWhere('ih.projectId = :projectId', { projectId });
    }
    if (query.issueId) {
      queryBuilder.andWhere('ih.issueId = :issueId', { issueId: query.issueId });
    }

    const [results, totalItems] = await queryBuilder
      .orderBy('ih.id', 'DESC')
      .skip(query.skip)
      .take(query.pageSize)
      .getManyAndCount();

    this.utilsService.assignThumbURLVer2(results, ['created', 'avatar']);

    return this.utilsService.returnPaging(results, totalItems, query);
  }
}

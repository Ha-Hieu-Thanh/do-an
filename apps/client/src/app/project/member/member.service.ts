import { GlobalCacheService } from '@app/cache';
import { Exception } from '@app/core/exception';
import Project from '@app/database-type-orm/entities/task-manager/Project';
import User from '@app/database-type-orm/entities/task-manager/User';
import UserProject from '@app/database-type-orm/entities/task-manager/UserProject';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ErrorCustom,
  NotificationContent,
  NotificationRedirectType,
  NotificationTargetType,
  NotificationTitle,
  NotificationType,
  TypeCacheData,
  UserProjectRole,
  UserProjectStatus,
  UserStatus,
  UserType,
} from 'libs/constants/enum';
import { DataSource, Repository } from 'typeorm';
import { AddMemberProjectDto } from './dto/add-member-project.dto';
import { ListMembersProjectDto } from './dto/list-project-member.dto';
import { UpdateMemberProjectDto } from './dto/update-member-project.dto';
import { QueueService } from '@app/queue';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(UserProject) private readonly userProjectRepository: Repository<UserProject>,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    private readonly globalCacheService: GlobalCacheService,
    private readonly queueService: QueueService,
  ) {}

  async listMembersProject(userId: number, projectId: number, query: ListMembersProjectDto) {
    const queryBuilder = this.userProjectRepository
      .createQueryBuilder('up')
      .innerJoinAndMapOne('up.user', User, 'u', 'u.id = up.userId')
      .select([
        'up.userId',
        'up.projectId',
        'up.role',
        'up.status',
        'up.issueCount',
        'up.createdAt',
        'u.id',
        'u.name',
        'u.avatar',
        'u.email',
      ])
      .where('up.projectId = :projectId', { projectId });

    if (query.keyword) {
      queryBuilder.andWhere('(u.name LIKE :keyword OR u.email LIKE :keyword)', { keyword: `%${query.keyword}%` });
    }
    if (query.status?.length) {
      queryBuilder.andWhere('up.status IN(:status)', { status: query.status });
    }
    if (query.roles?.length) {
      queryBuilder.andWhere('up.role IN(:roles)', { roles: query.roles });
    }

    const [results, totalItems] = await queryBuilder
      .orderBy('up.createdAt', 'DESC')
      .skip(query.skip)
      .take(query.pageSize)
      .getManyAndCount();

    this.utilsService.assignThumbURLVer2(results, ['user', 'avatar']);

    return this.utilsService.returnPaging(results, totalItems, query);
  }

  async addMemberProject(userId: number, projectId: number, params: AddMemberProjectDto) {
    return await this.dataSource.transaction(async (transaction) => {
      const userProjectRepository = transaction.getRepository(UserProject);
      const userRepository = transaction.getRepository(User);
      const projectRepository = transaction.getRepository(Project);

      const project = await projectRepository.findOne({ where: { id: projectId }, select: ['id', 'name'] });
      /* ------------------------------- Check email ------------------------------ */
      const userByEmail = await userRepository
        .createQueryBuilder('u')
        .leftJoinAndMapOne('u.userProject', UserProject, 'up', 'up.userId = u.id AND up.projectId = :projectId', {
          projectId,
        })
        .select(['u.id', 'u.email', 'u.status', 'up.userId', 'up.projectId', 'up.status', 'up.role'])
        .where('u.email = :email AND u.userType = :userTypeClient', {
          email: params.email,
          userTypeClient: UserType.CLIENT,
        })
        .getOne();

      if (!userByEmail) {
        throw new Exception(ErrorCustom.Email_User_Not_In_System);
      }

      if (userByEmail.status !== UserStatus.ACTIVE) {
        throw new Exception(ErrorCustom.Email_User_Not_Active);
      }

      const userProjectByEmail: UserProject = userByEmail['userProject'];
      if (userProjectByEmail && userProjectByEmail.status === UserProjectStatus.ACTIVE) {
        throw new Exception(ErrorCustom.User_Is_Already_In_The_Project);
      }

      if (userProjectByEmail) {
        await userProjectRepository.update(
          { userId: userByEmail.id, projectId },
          { status: UserProjectStatus.PENDING, role: params.role },
        );
      } else {
        await userProjectRepository.insert({
          userId: userByEmail.id,
          projectId,
          role: params.role,
          status: UserProjectStatus.PENDING,
          createdBy: userId,
        });
      }

      await this.globalCacheService.delByTypeKey(TypeCacheData.PROJECT_INFORMATION, projectId);

      this.queueService.addNotification({
        receiversId: [userByEmail.id],
        type: NotificationType.Invitation_To_The_Project,
        title: NotificationTitle.Invitation_To_The_Project,
        content: NotificationContent.Invitation_To_The_Project,
        targetType: NotificationTargetType.CLIENT,
        createdBy: userId,
        redirectId: projectId,
        redirectType: NotificationRedirectType.HOME,
        metadata: { projectName: project?.name },
      });

      return true;
    });
  }

  async updateMemberProject(userId: number, projectId: number, params: UpdateMemberProjectDto) {
    return await this.dataSource.transaction(async (transaction) => {
      const userProjectRepository = transaction.getRepository(UserProject);
      const projectRepository = transaction.getRepository(Project);

      const userProject = await userProjectRepository.findOne({
        where: { userId: params.userId, projectId },
        select: ['userId', 'projectId', 'role', 'status'],
      });

      if (!userProject) {
        throw new Exception(ErrorCustom.User_Not_In_Project);
      }

      if (userProject.status !== UserProjectStatus.ACTIVE) {
        throw new Exception(ErrorCustom.User_Project_Not_Active);
      }

      if (userProject.role === UserProjectRole.PM) {
        throw new Exception(ErrorCustom.Can_Not_Update_Pm_Project);
      }

      const task: (() => void)[] = [];

      task.push(() =>
        userProjectRepository.update(
          { userId: params.userId, projectId },
          { status: params.status, updatedBy: userId, role: params.role || userProject.role },
        ),
      );

      if (params.status === UserProjectStatus.IN_ACTIVE) {
        task.push(() => projectRepository.update({ id: projectId }, { memberCount: () => `member_count - 1` }));
      }

      await Promise.all(task.map((item) => item()));
      await this.globalCacheService.delByTypeKey(TypeCacheData.PROJECT_INFORMATION, projectId);

      return true;
    });
  }
}

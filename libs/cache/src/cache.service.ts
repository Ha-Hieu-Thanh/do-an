import { Exception } from '@app/core/exception';
import { IGetProjectInfoCache, IGetUserInfoCache, IUserProjectByUserId } from '@app/core/types';
import Project from '@app/database-type-orm/entities/task-manager/Project';
import ProjectIssueCategory from '@app/database-type-orm/entities/task-manager/ProjectIssueCategory';
import ProjectIssueState from '@app/database-type-orm/entities/task-manager/ProjectIssueState';
import ProjectIssueType from '@app/database-type-orm/entities/task-manager/ProjectIssueType';
import ProjectVersion from '@app/database-type-orm/entities/task-manager/ProjectVersion';
import User from '@app/database-type-orm/entities/task-manager/User';
import UserProject from '@app/database-type-orm/entities/task-manager/UserProject';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager/dist';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import {
  Environment,
  ErrorCustom,
  ProjectIssueCategoryStatus,
  ProjectIssueStateStatus,
  ProjectIssueTypeStatus,
  ProjectVersionStatus,
  TypeCacheData,
} from 'libs/constants/enum';
import { Repository } from 'typeorm';

@Injectable()
export class GlobalCacheService {
  // private readonly redis: Redis;
  private readonly logger: Logger = new Logger(GlobalCacheService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UtilsService))
    private readonly utilsService: UtilsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
  ) {
    // this.redis = new Redis({
    //   host: configService.get('redis').host,
    //   port: configService.get('redis').port,
    //   db: configService.get('redis').db,
    //   password: configService.get('redis').password,
    // });
  }

  createKeyCacheData(type: TypeCacheData, keyword?: any) {
    const nodeEnv = this.configService.get<Environment>('nodeEnv');
    const appName = this.configService.get('appName');

    if (keyword) return `key_cache:${appName}:${nodeEnv}:${type}:${keyword}`;
    return `key_cache:${appName}:${nodeEnv}:${type}`;
  }

  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, data: any, ttl?: number) {
    return await this.cacheManager.set(key, data, ttl);
  }

  async del(key: string) {
    return await this.cacheManager.del(key);
  }

  async delByTypeKey(type: TypeCacheData, id?: any) {
    const keyCache = this.createKeyCacheData(type, id);
    return await this.del(keyCache);
  }

  async resetCache() {
    return await this.cacheManager.reset();
  }

  async getUserInfo(userId: number): Promise<IGetUserInfoCache> {
    const keyCache = this.createKeyCacheData(TypeCacheData.USER_INFORMATION, userId);

    const cacheData = await this.get(keyCache);

    if (cacheData) return JSON.parse(cacheData) as IGetUserInfoCache;

    const user = (await this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.name', 'u.avatar', 'u.email', 'u.status', 'u.role'])
      .where('u.id = :userId', { userId })
      .getOne()) as IGetUserInfoCache;

    if (!user) {
      throw new Exception(ErrorCustom.Not_Found);
    }

    await this.set(keyCache, JSON.stringify(user));

    return user as IGetUserInfoCache;
  }

  async getMultiUserInfo(userIds: number[]): Promise<IGetUserInfoCache[]> {
    const users: IGetUserInfoCache[] = [];
    for (const userId of userIds) {
      const user = await this.getUserInfo(userId);
      users.push(user);
    }
    return users;
  }

  async getProjectInfo(projectId: number): Promise<IGetProjectInfoCache> {
    const keyCache = this.createKeyCacheData(TypeCacheData.PROJECT_INFORMATION, projectId);

    const cacheData = await this.get(keyCache);

    if (cacheData) return JSON.parse(cacheData) as IGetProjectInfoCache;

    const project = (await this.projectRepository
      .createQueryBuilder('p')
      .innerJoinAndMapMany('p.userProject', UserProject, 'up', 'up.projectId = p.id')
      .innerJoinAndMapOne('up.user', User, 'u', 'u.id = up.userId')
      .leftJoinAndMapMany(
        'p.projectIssueCategory',
        ProjectIssueCategory,
        'pic',
        'pic.projectId = p.id AND pic.status = :projectIssueCategoryStatusActive',
        { projectIssueCategoryStatusActive: ProjectIssueCategoryStatus.ACTIVE },
      )
      .leftJoinAndMapMany(
        'p.projectIssueState',
        ProjectIssueState,
        'pis',
        'pis.projectId = p.id AND pis.status = :projectIssueStateStatusActive',
        { projectIssueStateStatusActive: ProjectIssueStateStatus.ACTIVE },
      )
      .leftJoinAndMapMany(
        'p.projectIssueType',
        ProjectIssueType,
        'pit',
        'pit.projectId = p.id AND pit.status = :projectIssueTypeStatusActive',
        { projectIssueTypeStatusActive: ProjectIssueTypeStatus.ACTIVE },
      )
      .leftJoinAndMapMany(
        'p.projectVersion',
        ProjectVersion,
        'pv',
        'pv.projectId = p.id AND pv.status = :projectVersionStatusActive',
        { projectVersionStatusActive: ProjectVersionStatus.ACTIVE },
      )
      .select([
        'p.id',
        'p.name',
        'p.key',
        'up.userId',
        'up.role',
        'up.status',
        'u.email',
        'pic.id',
        'pic.order',
        'pic.name',
        'pis.id',
        'pis.order',
        'pis.name',
        'pit.id',
        'pit.order',
        'pit.name',
        'pv.id',
        'pv.order',
        'pv.name',
      ])
      .where('p.id = :projectId', { projectId })
      .orderBy('pic.order', 'DESC')
      .addOrderBy('pis.order', 'DESC')
      .addOrderBy('pit.order', 'DESC')
      .addOrderBy('pv.order', 'DESC')
      .getOne()) as any;

    if (!project) {
      throw new Exception(ErrorCustom.Project_Not_Found);
    }

    const userProjectByUserId: IUserProjectByUserId = project['userProject'].reduce((acc, cur) => {
      acc[cur.userId] = cur;
      return acc;
    }, {});
    Object.assign(project, { userProjectByUserId });
    delete project['userProject'];

    const { projectIssueCategory, projectIssueCategoryById } = project['projectIssueCategory'].reduce(
      (acc, cur) => {
        acc.projectIssueCategory.push(cur.id);
        acc.projectIssueCategoryById[cur.id] = cur;
        return acc;
      },
      { projectIssueCategory: [] as number[], projectIssueCategoryById: {} as { [key: string]: ProjectIssueCategory } },
    );
    const { projectIssueState, projectIssueStateById } = project['projectIssueState'].reduce(
      (acc, cur) => {
        acc.projectIssueState.push(cur.id);
        acc.projectIssueStateById[cur.id] = cur;
        return acc;
      },
      { projectIssueState: [] as number[], projectIssueStateById: {} as { [key: string]: ProjectIssueState } },
    );
    const { projectIssueType, projectIssueTypeById } = project['projectIssueType'].reduce(
      (acc, cur) => {
        acc.projectIssueType.push(cur.id);
        acc.projectIssueTypeById[cur.id] = cur;
        return acc;
      },
      { projectIssueType: [] as number[], projectIssueTypeById: {} as { [key: string]: ProjectIssueType } },
    );
    const { projectVersion, projectVersionById } = project['projectVersion'].reduce(
      (acc, cur) => {
        acc.projectVersion.push(cur.id);
        acc.projectVersionById[cur.id] = cur;
        return acc;
      },
      { projectVersion: [] as number[], projectVersionById: {} as { [key: string]: ProjectVersion } },
    );

    Object.assign(project, {
      projectIssueCategory,
      projectIssueCategoryById,
      projectIssueState,
      projectIssueStateById,
      projectIssueType,
      projectIssueTypeById,
      projectVersion,
      projectVersionById,
    });

    await this.set(keyCache, JSON.stringify(project));

    return project as IGetProjectInfoCache;
  }
}

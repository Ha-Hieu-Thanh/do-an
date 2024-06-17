import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto/edit-user.dto';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { GlobalCacheService } from '@app/cache';
import { DataSource } from 'typeorm';
import { ListUserDto } from './dto/list-user.dto';
import { ListProjectDto } from './dto/list-project.dto';
import User from '@app/database-type-orm/entities/task-manager/User';
import Project from '@app/database-type-orm/entities/task-manager/Project';
import { Exception } from '@app/core/exception';
import { ErrorCustom, TypeCacheData } from 'libs/constants/enum';

@Injectable()
export class AdminService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly utilsService: UtilsService,
    private readonly globalCacheService: GlobalCacheService,
  ) {}

  async editUser(adminId: number, body: EditUserDto, userId: number) {
    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Exception(ErrorCustom.Not_Found);
    }

    await this.dataSource.getRepository(User).update(
      { id: userId },
      {
        ...body,
        updatedBy: adminId,
      },
    );
    await this.globalCacheService.delByTypeKey(TypeCacheData.USER_INFORMATION, userId);
    return true;
  }

  async listProject(query: ListProjectDto) {
    const listProjectQuery = this.dataSource
      .getRepository(Project)
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.memberCount',
        'p.issueCount',
        'p.name',
        'p.key',
        'p.createdBy',
        'p.updatedBy',
        'p.createdAt',
        'p.updatedAt',
      ]);

    if (query.keyword) {
      listProjectQuery.andWhere('p.name LIKE :keyword OR p.key LIKE :keyword', { keyword: `%${query.keyword}%` });
    }

    const [results, totalItems] = await listProjectQuery
      .orderBy('p.id', 'DESC')
      .skip(query.skip)
      .take(query.pageSize)
      .getManyAndCount();

    return this.utilsService.returnPaging(results, totalItems, query);
  }

  async listUser(query: ListUserDto) {
    const listUserQuery = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('u')
      .select([
        'u.id',
        'u.avatar',
        'u.name',
        'u.gender',
        'u.email',
        'u.address',
        'u.birthday',
        'u.role',
        'u.status',
        'u.updatedBy',
        'u.createdAt',
        'u.updatedAt',
      ]);

    if (query.keyword) {
      listUserQuery.andWhere('(u.name LIKE :keyword OR u.email LIKE :keyword)', { keyword: `%${query.keyword}%` });
    }

    const [results, totalItems] = await listUserQuery
      .orderBy('u.id', 'DESC')
      .skip(query.skip)
      .take(query.pageSize)
      .getManyAndCount();

    this.utilsService.assignThumbURLVer2(results, ['avatar']);
    return this.utilsService.returnPaging(results, totalItems, query);
  }
}

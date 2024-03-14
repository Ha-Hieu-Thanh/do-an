import { Injectable } from '@nestjs/common';
import { CreateWikiProjectDto } from './dto/create-wiki-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wiki } from '@app/database-type-orm/entities/task-manager/Wiki';
import { Repository } from 'typeorm';
import { ListWikiProjectDto } from './dto/list-wiki-project.dto';
import { ErrorCustom, WikiStatus } from 'libs/constants/enum';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { UpdateWikiProjectDto } from './dto/update-wiki-project.dto';
import { Exception } from '@app/core/exception';
import User from '@app/database-type-orm/entities/task-manager/User';

@Injectable()
export class WikiService {
  constructor(
    @InjectRepository(Wiki) private readonly wikiRepository: Repository<Wiki>,
    private readonly utilsService: UtilsService,
  ) {}

  async checkWikiExistInProject(wikiId: number, projectId: number) {
    const wiki = await this.wikiRepository.findOne({ where: { id: wikiId, projectId } });

    if (!wiki) {
      throw new Exception(ErrorCustom.Wiki_Project_Not_Found);
    }

    return wiki;
  }

  async create(userId: number, projectId: number, params: CreateWikiProjectDto) {
    await this.wikiRepository.insert({ createdBy: userId, projectId, ...params });
    return true;
  }

  async list(userId: number, projectId: number, query: ListWikiProjectDto) {
    const queryBuilder = this.wikiRepository
      .createQueryBuilder('w')
      .innerJoinAndMapOne('w.created', User, 'u', 'u.id = w.createdBy')
      .select(['w.id', 'w.subject', 'w.content', 'w.createdAt', 'u.id', 'u.name', 'u.email', 'u.avatar'])
      .where('w.projectId = :projectId AND w.status = :status', { projectId, status: WikiStatus.ACTIVE });

    if (query.keyword) {
      queryBuilder.andWhere('w.subject LIKE :keyword', { keyword: `%${query.keyword}%` });
    }

    const [results, totalItems] = await queryBuilder.skip(query.skip).take(query.pageSize).getManyAndCount();

    this.utilsService.assignThumbURLVer2(results, ['created', 'avatar']);
    
    return this.utilsService.returnPaging(results, totalItems, query);
  }

  async detail(userId: number, projectId: number, wikiId: number) {
    const wiki = await this.checkWikiExistInProject(wikiId, projectId);

    return wiki;
  }

  async update(userId: number, projectId: number, wikiId: number, params: UpdateWikiProjectDto) {
    const wiki = await this.checkWikiExistInProject(wikiId, projectId);

    await this.wikiRepository.update({ id: wikiId }, { ...params, updatedBy: userId });
    return true;
  }
}

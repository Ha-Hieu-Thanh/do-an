import User from '@app/database-type-orm/entities/task-manager/User';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GlobalCacheService } from '@app/cache';
import { TypeCacheData } from 'libs/constants/enum';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly utilsService: UtilsService,
    private readonly globalCacheService: GlobalCacheService,
  ) {}
  async myProfile(userId: number) {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.name', 'u.avatar', 'u.gender', 'u.address', 'u.birthday', 'u.email', 'u.phone', 'u.role'])
      .where('u.id = :userId', { userId })
      .getOne();

    this.utilsService.assignThumbURLVer2(user, ['avatar']);

    return user;
  }

  async updateProfile(userId: number, params: UpdateProfileDto) {
    await this.userRepository.update({ id: userId }, { ...params, updatedBy: userId });
    await this.globalCacheService.delByTypeKey(TypeCacheData.USER_INFORMATION, userId);
    return true;
  }
}

import { Exception, WsExceptionNew } from '@app/core/exception';

import User from '@app/database-type-orm/entities/task-manager/User';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustom } from 'libs/constants/enum';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SocketService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

}

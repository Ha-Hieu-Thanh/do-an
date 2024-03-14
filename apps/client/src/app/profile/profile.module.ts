import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { HelpersModule } from '@app/helpers';
import User from '@app/database-type-orm/entities/task-manager/User';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HelpersModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}

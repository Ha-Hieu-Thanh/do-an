import { Module } from '@nestjs/common';
import { VersionService } from './version.service';
import { VersionController } from './version.controller';
import ProjectVersion from '@app/database-type-orm/entities/task-manager/ProjectVersion';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectVersion])],
  controllers: [VersionController],
  providers: [VersionService],
})
export class VersionModule {}

import { Module } from '@nestjs/common';
import { WikiService } from './wiki.service';
import { WikiController } from './wiki.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wiki } from '@app/database-type-orm/entities/task-manager/Wiki';

@Module({
  imports: [TypeOrmModule.forFeature([Wiki])],
  controllers: [WikiController],
  providers: [WikiService]
})
export class WikiModule {}

import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserProject from '@app/database-type-orm/entities/task-manager/UserProject';
import { QueueModule } from '@app/queue';

@Module({
  imports: [TypeOrmModule.forFeature([UserProject]), QueueModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '@app/database-type-orm/entities/task-manager/User';
import { HelpersModule } from '@app/helpers';
import { QueueModule } from '@app/queue';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HelpersModule, QueueModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

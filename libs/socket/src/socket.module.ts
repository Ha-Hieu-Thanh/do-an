// import User from '@app/database-type-orm/entities/User';
import User from '@app/database-type-orm/entities/task-manager/User';
import { HelpersModule } from '@app/helpers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsGateway } from './events.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [HelpersModule, TypeOrmModule.forFeature([User])],
  providers: [SocketService, EventsGateway],
  controllers: [],
  exports: [SocketService],
})
export class SocketModule {}

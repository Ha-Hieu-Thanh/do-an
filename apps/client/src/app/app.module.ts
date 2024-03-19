import { LoggerReqMiddleware } from '@app/core/middlewares/logger.middleware';
import { IConfig } from '@app/helpers/config-env/configuration';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { IMPORT_MODULE_COMMON, PROVIDERS_MODULE_COMMON } from 'apps/module.common';
import { Environment } from 'libs/constants/enum';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectModule } from './project/project.module';
import { Transport } from '@nestjs/microservices/enums';
import { ClientsModule } from '@nestjs/microservices';
import Notification from '@app/database-type-orm/entities/task-manager/Notification';
import { TypeOrmModule } from '@nestjs/typeorm';
import NotificationMember from '@app/database-type-orm/entities/task-manager/NotificationMember';

const moduleFeatures = [AuthModule, ProjectModule, ProfileModule];
@Module({
  imports: [
    ...IMPORT_MODULE_COMMON,
    /* -------------------------------------------------------------------------- */
    /*                                 Rate limit                                 */
    /* -------------------------------------------------------------------------- */
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 300,
    }),
    ...moduleFeatures,
    TypeOrmModule.forFeature([Notification, NotificationMember]),
  ],
  controllers: [AppController],
  providers: [...PROVIDERS_MODULE_COMMON, AppService],
})
export class AppModule {
  constructor(private configService: ConfigService<IConfig, true>) {}

  configure(consumer: MiddlewareConsumer) {
    const nodeEnv = this.configService.get<Environment>('nodeEnv');

    if (![Environment.Production].includes(nodeEnv)) {
      consumer.apply(LoggerReqMiddleware).forRoutes('*');
    }
  }
}

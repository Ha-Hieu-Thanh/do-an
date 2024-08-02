import * as redisStore from 'cache-manager-redis-store';
import { Global, Module } from '@nestjs/common';
import { GlobalCacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig } from '@app/helpers/config-env/configuration';
import { HelpersModule } from '@app/helpers';
import { CacheModule } from '@nestjs/cache-manager';
import User from '@app/database-type-orm/entities/task-manager/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import Project from '@app/database-type-orm/entities/task-manager/Project';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<IConfig, true>) => {
        return {
          store: redisStore,
          host: configService.get('redis').host,
          port: configService.get('redis').port,
          db: configService.get('redis').db,
          password: configService.get('redis').password,
          // ttl: configService.get('redis').ttl,
        };
      },
    }),
    HelpersModule,
    TypeOrmModule.forFeature([User, Project]),
  ],
  providers: [GlobalCacheService],
  exports: [GlobalCacheService],
})
export class GlobalCacheModule {}

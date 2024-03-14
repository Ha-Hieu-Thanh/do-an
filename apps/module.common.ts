import { AuthorizationModule } from '@app/authorization';
import { GlobalCacheModule } from '@app/cache';
import { dataTaskManagerSource } from '@app/database-type-orm/data-source-task-manager';
import { HelpersModule } from '@app/helpers';
import configuration, { IConfig, IConfigAuth, IConfigNodemailer } from '@app/helpers/config-env/configuration';
import { validateEnvironment } from '@app/helpers/config-env/validate';
import { JwtAuthenticationModule } from '@app/jwt-authentication';
import { LibraryS3UploadModule } from '@app/s3-upload';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from 'libs/socket/src';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LibrarySendMailModule } from '@app/send-mail';
import { Provider } from '@nestjs/common/interfaces';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthenticationGuard } from '@app/jwt-authentication/jwt-authentication.guard';
import { AllExceptionsFilter } from '@app/core/filters/http-exeption.filter';
import { TransformResponseInterceptor } from '@app/core/interceptors/transform-res.interceptor';
import { AuthGuardUrl } from '@app/core/guards/auth.guard';
import { DatabaseMongodbModule } from '@app/database-mongodb';

export const IMPORT_MODULE_COMMON: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    cache: true,
    validate: validateEnvironment,
  }),
  /* -------------------------------------------------------------------------- */
  /*                          Basic JWT Authentication                          */
  /* -------------------------------------------------------------------------- */
  JwtAuthenticationModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService<IConfig, true>) => ({
      ...configService.get<IConfigAuth>('auth'),
    }),
    inject: [ConfigService],
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService<IConfig, true>) => ({
      ...configService.get('typeORMOptions'),
    }),
    dataSourceFactory: async () => {
      return await dataTaskManagerSource.initialize();
    },
    inject: [ConfigService],
  }),
  LibraryS3UploadModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService<IConfig, true>) => ({
      ...configService.get('s3Upload'),
    }),
    inject: [ConfigService],
  }),
  LibrarySendMailModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService<IConfig, true>) => ({
      nodemailer: configService.get<IConfigNodemailer>('nodemailer'),
    }),
    inject: [ConfigService],
  }),
  HelpersModule,
  GlobalCacheModule,
  AuthorizationModule,
  SocketModule,
  EventEmitterModule.forRoot(),
  DatabaseMongodbModule
];

export const PROVIDERS_MODULE_COMMON: Provider[] = [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
  {
    provide: APP_GUARD,
    useClass: JwtAuthenticationGuard,
  },
  {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: TransformResponseInterceptor,
  },
  {
    provide: APP_GUARD,
    useClass: AuthGuardUrl,
  },
];

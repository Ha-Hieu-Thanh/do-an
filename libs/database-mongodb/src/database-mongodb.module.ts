import { Module } from '@nestjs/common';
import { DatabaseMongodbService } from './database-mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig } from '@app/helpers/config-env/configuration';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IConfig, true>) => {
        const uri = configService.get('database').mongodbUri;
        if (!uri) {
          throw new Error('Missing configuration "database.mongodbUri"');
        }

        return { uri };
      },
      inject: [ConfigService],
    }),

  ],

  providers: [DatabaseMongodbService],
  exports: [DatabaseMongodbService],
})
export class DatabaseMongodbModule {}

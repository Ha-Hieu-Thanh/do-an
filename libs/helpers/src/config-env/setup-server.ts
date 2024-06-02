import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';
import helmet from 'helmet';
import { ErrorCustom } from 'libs/constants/enum';
import { ConfigSystemService } from '../config-system/config-system.service';
import { LoggingService } from '../logging/logging.service';
import { IConfig, IConfigRedis } from './configuration';
import { Exception } from '@app/core/exception';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { RedisIoAdapter } from 'libs/socket/src/ioredis-io.adapter';

export async function SetupServerCommon(app: NestExpressApplication, port: number) {
  const configService: ConfigService<IConfig> = app.get(ConfigService);
  const configSystemService: ConfigSystemService = app.get(ConfigSystemService);
  const appName = configService.get<string>('appName', '');
  const contact = { name: 'Ha Hieu Thanh', email: 'hieuthanh4a2@gmail.com', url: 'https://github.com/Ha-Hieu-Thanh' };
  const logger = new Logger(`${appName}`);
  const redisConfig = configService.get<IConfigRedis>('redis');
  if (!redisConfig) {
    throw new Exception(ErrorCustom.Redis_Missing);
  }

  configSystemService.setUpLoggerLog4js();
  configSystemService.setupSwagger(app, appName, '1.0', contact);
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(json({ limit: '150mb' }));
  app.useLogger(new LoggingService());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // use redis as a adapter
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(redisConfig);
  app.useWebSocketAdapter(redisIoAdapter);

  app.startAllMicroservices();

  await app.listen(port, () => {
    logger.log(`=== task manager running on port: ${port}. pid: ${process.pid} ===`);
  });
}

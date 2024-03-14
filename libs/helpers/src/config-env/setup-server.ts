import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';
import helmet from 'helmet';
import { ErrorCustom, StartUrl } from 'libs/constants/enum';
import { ConfigSystemService } from '../config-system/config-system.service';
import { LoggingService } from '../logging/logging.service';
import { IConfig, IConfigRedis } from './configuration';
// import { RedisIoAdapter } from 'libs/socket/src/ioredis-io.adapter';
import { Exception } from '@app/core/exception';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';

export async function SetupServerCommon(app: NestExpressApplication, name: string, port: number, startUrl: StartUrl) {
  const configService: ConfigService<IConfig> = app.get(ConfigService);
  const configSystemService: ConfigSystemService = app.get(ConfigSystemService);
  const appName = configService.get<string>('appName', '');
  const contact = { name: "Ha Hieu Thanh", email:"hieuthanh4a2@gmail.com", url: "https://github.com/Ha-Hieu-Thanh" };
  const logger = new Logger(`${appName}:${name}`);
  const redisConfig = configService.get<IConfigRedis>('redis');
  if (!redisConfig) {
    throw new Exception(ErrorCustom.Redis_Missing);
  }

  configSystemService.setUpLoggerLog4js();
  configSystemService.setupSwagger(app, appName, '1.0', contact, startUrl);
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

  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis(redisConfig);
  // app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(port, () => {
    logger.log(`=== task manager ${name} running on port: ${port}. pid: ${process.pid} ===`);
  });
}

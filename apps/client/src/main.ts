import { SetupServerCommon } from '@app/helpers/config-env/setup-server';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    cors: true,
  });
  // const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: ['localhost:9092'],
  //     },
  //     consumer: {
  //       groupId: 'my-consumer-group',
  //     },
  //   },
  // });

  const port = app.get(ConfigService).get<number>('portClient', 3002);
  await SetupServerCommon(app, port);
}
bootstrap();

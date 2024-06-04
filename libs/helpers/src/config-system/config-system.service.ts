import { INestApplication } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configure } from 'log4js';

@Injectable()
export class ConfigSystemService {
  setupSwagger(
    app: INestApplication,
    appName: string,
    version: string,
    contact: {
      name: string;
      url: string;
      email: string;
    },
  ) {
    const documentBuilder = new DocumentBuilder()
      .setTitle(`IT4997 - Graduation Project Documentation`)
      .setDescription('Final graduation documentation by SOICT student')
      .setVersion(version)
      .setContact(contact.name, contact.url, contact.email)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, documentBuilder);
    SwaggerModule.setup(`/api`, app, document);
  }

  setUpLoggerLog4js() {
    configure({
      appenders: {
        console: {
          type: 'console',
        },
        errorFile: {
          type: 'dateFile',
          filename: 'logs/error.log',
          keepFileExt: true,
          numBackups: 10,
        },
        errors: {
          type: 'logLevelFilter',
          level: 'ERROR',
          appender: 'errorFile',
        },
      },
      categories: {
        default: { appenders: ['console', 'errors'], level: 'debug' },
      },
    });
  }
}

import { UtilsService } from '@app/helpers/utils/utils.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  LiteralObject,
  Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Environment, ErrorValues, ValuesImportant } from 'libs/constants/enum';

export interface IRequest extends Request {
  payload: LiteralObject | any;
}

export interface IFormatErrorObject {
  success: boolean;
  statusCode: number;
  errorValue: ErrorValues;
  errorCode?: string;
  devMessage?: string;
  payload?: any;
  errorMessage?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly nodeEnv: Environment;

  constructor(
    private readonly utilsService: UtilsService,
    private readonly configService: ConfigService,
  ) {
    this.nodeEnv = this.configService.get<Environment>('nodeEnv', Environment.Development);
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<IRequest>();

    Object.assign(exception, {
      request: {
        method: request.method,
        url: request.url,
        body: this.utilsService.hideImportantInformation(request.body, ValuesImportant),
        ip: request.ip,
        payload: request.payload,
      },
    });

    this.logger.error(Object.assign(exception, { env: this.nodeEnv }));

    const { statusCode, ...errorObject } = await this.utilsService.formatErrorObject(exception);

    response.status(statusCode).json(errorObject);
  }
}

import { Exception } from '@app/core/exception';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { Catch, ArgumentsHost, Inject } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { ErrorCustom, SocketEventKeys, ValuesImportant } from 'libs/constants/enum';
import { SocketService } from './socket.service';
import { IRequest } from '@app/core/filters/http-exeption.filter';

@Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  constructor(private readonly utilsService: UtilsService) {
    super();
  }
  async catch(exception: any, host: ArgumentsHost) {
    const [, , fn] = host.getArgs();
    if (typeof fn === 'function') {
      const { statusCode, ...errorObject } = await this.utilsService.formatErrorObject(exception);

      fn(errorObject);
    }
    super.catch(exception, host);
  }

  handleError<TClient extends { emit: Function }>(client: TClient, exception: any): void {
    super.handleError(client, exception);
  }

  handleUnknownError<TClient extends { emit: Function }>(exception: any, client: TClient): void {
    super.handleUnknownError(exception, client);
  }
}

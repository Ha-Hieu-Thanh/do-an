// import { GlobalCacheService } from '@app/cache';
// import { dataTaskManagerSource } from '@app/database-type-orm/data-source-task-manager';
// import { UtilsService } from '@app/helpers/utils/utils.service';
// import LogAction from '@app/log-action/entities/LogAction';
// import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
// import { ActionType, CommonStatus, ValuesImportant } from 'libs/constants/enum';
// import { Observable, catchError, tap, throwError } from 'rxjs';
// import { Request } from 'express';

// export interface Response<T> {
//   data: T;
// }

// export const ActionTypeByUrl = {};

// @Injectable()
// export class LogActionInterceptor<T> implements NestInterceptor<T, Response<T>> {
//   private readonly logger: Logger = new Logger(LogActionInterceptor.name);
//   constructor(private readonly globalCacheService: GlobalCacheService, private readonly utilsService: UtilsService) {}

//   async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Response<T>>> {
//     const request = context?.switchToHttp()?.getRequest() as Request;
//     const logActionRepository = dataTaskManagerSource.getRepository(LogAction);
//     const now = Date.now();
//     const { body, payload, url, method, ip, query, ...other } = request;
//     const type = ActionTypeByUrl[url.split('?')[0]] || ActionType.TRANSACTION;

//     const data = this.utilsService.hideImportantInformation(request.body, ValuesImportant);
//     const dataLogAction = <LogAction>{
//       type,
//       url,
//       method,
//       body: JSON.stringify(data),
//       ip,
//       query: JSON.stringify(query),
//     };
//     if (payload?.id) {
//       Object.assign(dataLogAction, { createdBy: payload.id });
//     }

//     return next.handle().pipe(
//       tap((response) => {
//         Object.assign(dataLogAction, { data: JSON.stringify({ ...response }), timeCall: Date.now() - now });
//         logActionRepository.insert(dataLogAction);
//       }),

//       catchError((err) => {
//         Object.assign(dataLogAction, {
//           data: JSON.stringify({ ...err }),
//           status: CommonStatus.IN_ACTIVE,
//           timeCall: Date.now() - now,
//         });
//         logActionRepository.insert(dataLogAction);

//         return throwError(() => err);
//       }),
//     );
//   }
// }

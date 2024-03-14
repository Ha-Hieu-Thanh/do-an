import { UtilsService } from '@app/helpers/utils/utils.service';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ValuesImportant } from 'libs/constants/enum';

@Injectable()
export class LoggerReqMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerReqMiddleware.name);

  constructor(private readonly utilsService: UtilsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const body = this.utilsService.hideImportantInformation(req.body, ValuesImportant);

    this.logger.debug(`[${req.method}]-[${req.ip}]: ${req.originalUrl}`);
    (async () => {
      try {
        const str = JSON.stringify(body);

        if (str.length < 2000) {
          this.logger.debug(str);
        } else {
          this.logger.debug('Body too large');
        }
      } catch (error) {}
    })();
    next();
  }
}

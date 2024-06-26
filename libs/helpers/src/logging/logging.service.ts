import { ConsoleLogger } from '@nestjs/common';
import { getLogger } from 'log4js';

export class LoggingService extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    getLogger(context).error(stack, message);
  }
}

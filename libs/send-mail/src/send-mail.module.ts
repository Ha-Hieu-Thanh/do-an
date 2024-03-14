import { Module } from '@nestjs/common';
import { LibrarySendMailService } from './send-mail.service';
import { ConfigurableModuleClass } from './send-mail.module-definition';

@Module({
  providers: [LibrarySendMailService],
  exports: [LibrarySendMailService],
})
export class LibrarySendMailModule extends ConfigurableModuleClass {}

import { ConfigurableModuleBuilder } from '@nestjs/common';
import { SendMailModuleOptions } from './send-mail.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<SendMailModuleOptions>().build();

import { ConfigurableModuleBuilder } from '@nestjs/common';
import { S3uploadOptions } from './s3-upload.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<S3uploadOptions>().build();

import { Exception } from '@app/core/exception';
import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';
import { ErrorCustom } from 'libs/constants/enum';

enum Environment {
  Test = 'test',
  Development = 'development',
  staging = 'staging',
  Production = 'production',
}

class EnvironmentVariables {
  // @IsNotEmpty()
  // @IsEnum(Environment)
  // NODE_ENV: Environment;

  // @IsNotEmpty()
  // @IsNumber()
  // SERVER_PORT_MAIN: number;

  // @IsNotEmpty()
  // @IsString()
  // APP_NAME: string;

  // @IsNotEmpty()
  // @IsString()
  // CONTACT_NAME: string;

  // @IsNotEmpty()
  // @IsString()
  // CONTACT_URL: string;

  // @IsNotEmpty()
  // @IsString()
  // CONTACT_EMAIL: string;

  // TODO validate
}

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    const logger = new Logger('validateEnvironment');
    // logger.error(errors)
  }
  return validatedConfig;
}

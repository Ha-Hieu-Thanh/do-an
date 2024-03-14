import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigSystemService } from './config-system/config-system.service';
import { HelpersService } from './helpers.service';
import { UtilsService } from './utils/utils.service';

@Global()
@Module({
  providers: [HelpersService, UtilsService, ConfigSystemService],
  exports: [HelpersService, UtilsService, ConfigSystemService],
})
export class HelpersModule {}

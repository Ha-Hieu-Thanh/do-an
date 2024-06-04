import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { HelpersModule } from '@app/helpers';

@Module({
  imports: [HelpersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

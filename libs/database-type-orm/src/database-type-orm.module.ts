import { Module } from '@nestjs/common';
import { DatabaseTypeOrmService } from './database-type-orm.service';

@Module({
  providers: [DatabaseTypeOrmService],
  exports: [DatabaseTypeOrmService],
  imports: [],
})
export class DatabaseTypeOrmModule {}

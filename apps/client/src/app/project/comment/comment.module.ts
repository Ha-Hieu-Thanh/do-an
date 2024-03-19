import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentDocument } from '@app/database-mongodb/schemas/comment.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import Issue from '@app/database-type-orm/entities/task-manager/Issue';
import { QueueModule } from '@app/queue';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'comments',
        schema: CommentDocument.schema,
      },
    ]),
    TypeOrmModule.forFeature([Issue]),
    QueueModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}

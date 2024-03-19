import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument } from '@app/database-mongodb/schemas/comment.schema';
import { Repository } from 'typeorm';
import Issue from '@app/database-type-orm/entities/task-manager/Issue';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from '@app/core/exception';
import {
  EmitterConstant,
  ErrorCustom,
  NotificationContent,
  NotificationRedirectType,
  NotificationTargetType,
  NotificationTitle,
  NotificationType,
} from 'libs/constants/enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetListCommentDto } from './dto/get-list-comment.dto';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { QueueService } from '@app/queue';
import { GlobalCacheService } from '@app/cache';
import * as format from 'string-format';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('comments')
    private readonly commentModel: Model<CommentDocument>,
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    private readonly eventEmitter: EventEmitter2,
    private readonly utilsService: UtilsService,
    private readonly queueService: QueueService,
    private readonly globalCacheService: GlobalCacheService,
  ) {}

  async getCommentByIssueId(issueId: number, projectId: number, query: GetListCommentDto) {
    // validate if issueId belongs to projectId
    const issue = await this.issueRepository.findOne({ where: { id: issueId } });
    if (!issue || issue.projectId !== projectId) {
      throw new Exception(ErrorCustom.Issue_Not_Invalid, 'Issue không hợp lệ');
    }
    // query have properties keyword, skip, pageSize, pageIndex
    // return this.commentModel.find({ issueId }).sort({ _id: -1 });
    const { keyword, pageSize, skip } = query;
    const condition = { issueId };
    if (keyword) {
      condition['$text'] = { $search: keyword };
    }
    // search on field content -> create inđex

    const totalItems = await this.commentModel.countDocuments(condition);
    const comments = await this.commentModel.find(condition).sort({ _id: -1 }).skip(skip!).limit(pageSize!);
    return this.utilsService.returnPaging(comments, totalItems, query);
  }

  async createComment(issueId: number, projectId: number, userId: number, data: CreateCommentDto) {
    // validate if issueId belongs to projectId
    const issue = await this.issueRepository.findOne({ where: { id: issueId } });
    if (!issue || issue.projectId !== projectId) {
      throw new Exception(ErrorCustom.Issue_Not_Invalid, 'Issue không hợp lệ');
    }
    if (!data.content && !data.files) {
      throw new Exception(ErrorCustom.Comment_Content_Or_Files_Required, 'Nội dung hoặc file đính kèm là bắt buộc');
    }

    const comment = await this.commentModel.create({ ...data, issueId, userId });
    // if create successfully
    if (!comment) {
      throw new Exception(ErrorCustom.Comment_Create_Failed, 'Tạo comment thất bại');
    }

    if (comment.content) {
      const user = await this.globalCacheService.getUserInfo(userId);
      const project = await this.globalCacheService.getProjectInfo(projectId);
      // get people are mentioned in content
      const mentionedUserIds = this.utilsService.getMentionedUsers(data.content);
      // push notification to people are mentioned in content

      this.queueService.addNotification({
        receiversId: mentionedUserIds,
        type: NotificationType.YOU_ARE_MENTIONED,
        title: NotificationTitle.YOU_ARE_MENTIONED,
        content: NotificationContent.YOU_ARE_MENTIONED,
        targetType: NotificationTargetType.CLIENT,
        createdBy: userId,
        targetId: projectId,
        redirectType: NotificationRedirectType.PROJECT_ISSUE,
        redirectId: projectId,
        metadata: {
          username: user.name,
          issueId,
          projectKey: project.key,
          issueSubject: issue.subject,
          content: comment.content,
        },
      });
    }
    // TODO: emit to the list user who are watching this issue
    this.eventEmitter.emitAsync(EmitterConstant.EMIT_TO_CLIENT_CREATE_COMMENT, issueId, comment);
    return comment;
  }
}

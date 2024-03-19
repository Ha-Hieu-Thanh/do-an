import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Project } from '@app/core/decorator/api-project.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AssignPagingPipe, CustomParseIntPipe } from '@app/core/pipes/validation.pipe';
import { CheckPolicies, PolicyHandlerCustom } from '@app/core/decorator/check-policies.decorator';
import { Action, Subject } from '@app/authorization';
import { Request } from 'express';
import { UserData } from '@app/core/decorator/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetListCommentDto } from './dto/get-list-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * fetch the comment by issue id, paging, order by id descending
   */
  @Get(':issueId')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectIssue))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get comment by issue id, paging, order by id descending',
  })
  async getCommentByIssueId(
    @Param('issueId', CustomParseIntPipe) issueId: number,
    @Req() req: Request,
    @Query(AssignPagingPipe) query: GetListCommentDto,
  ) {
    return this.commentService.getCommentByIssueId(issueId, req.projectId, query);
  }

  /**
   * create comment to the issue id
   */
  @Post(':issueId')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Create, Subject.ProjectIssue))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create comment to the issue id',
  })
  async createComment(
    @Param('issueId', CustomParseIntPipe) issueId: number,
    @Req() req: Request,
    @UserData() user: Express.User,
    @Body() data: CreateCommentDto,
  ) {
    return this.commentService.createComment(issueId, req.projectId, user.id, data);
  }

  /**
   * TODO:
   * 1) frontend fetch list getCommentByIssueId
   * 2) frontend post createComment -> emit to others clients with event name = "COMMENT"
   */
}

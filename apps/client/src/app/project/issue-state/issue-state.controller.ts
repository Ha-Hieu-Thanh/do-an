import { Action, Subject } from '@app/authorization';
import { Project } from '@app/core/decorator/api-project.decorator';
import { CheckPolicies, PolicyHandlerCustom } from '@app/core/decorator/check-policies.decorator';
import { ClientControllers } from '@app/core/decorator/controller-customer.decorator';
import { UserData } from '@app/core/decorator/user.decorator';
import { AssignPagingPipe, CustomParseIntPipe } from '@app/core/pipes/validation.pipe';
import { Body, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { BasicResponseExample } from 'libs/constants/schema';
import { CreateProjectIssueStateDto } from './dto/create-project-issue-state.dto';
import { ListProjectIssueStateDto } from './dto/list-project-state-state.dto';
import { UpdateProjectIssueStateDto } from './dto/update-project-issue-type.dto';
import { detailProjectIssueStateSchema, listProjectIssueStateSchema } from './issue-state.schema';
import { IssueStateService } from './issue-state.service';

@ClientControllers('project/issue-state')
@Project()
export class IssueStateController {
  constructor(private readonly issueStateService: IssueStateService) {}

  @Get('list')
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectIssueState))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List project issue state',
  })
  @ApiResponse(listProjectIssueStateSchema)
  async listProjectIssueState(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Query(AssignPagingPipe) query: ListProjectIssueStateDto,
  ) {
    return this.issueStateService.listProjectIssueState(user.id, req.projectId, query);
  }

  @Post('create')
  @CheckPolicies(new PolicyHandlerCustom(Action.Create, Subject.ProjectIssueState))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create project issue state',
  })
  @ApiResponse(BasicResponseExample)
  async createProjectIssueState(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Body() body: CreateProjectIssueStateDto,
  ) {
    return this.issueStateService.createProjectIssueState(user.id, req.projectId, body);
  }

  @Get('detail/:issueStateId')
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectIssueState))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Detail project issue State',
  })
  @ApiResponse(detailProjectIssueStateSchema)
  async detailProjectIssueState(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Param('issueStateId', CustomParseIntPipe) issueStateId: number,
  ) {
    return this.issueStateService.detailProjectIssueState(user.id, req.projectId, issueStateId);
  }

  @Patch('update')
  @CheckPolicies(new PolicyHandlerCustom(Action.Update, Subject.ProjectIssueState))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Pm update project issue State',
  })
  @ApiResponse(BasicResponseExample)
  async updateProjectIssueState(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Body() body: UpdateProjectIssueStateDto,
  ) {
    return this.issueStateService.updateProjectIssueState(user.id, req.projectId, body);
  }
}

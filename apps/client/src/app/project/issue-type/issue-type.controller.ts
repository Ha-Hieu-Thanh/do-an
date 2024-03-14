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
import { CreateProjectIssueTypeDto } from './dto/create-project-issue-type.dto';
import { ListProjectIssueTypeDto } from './dto/list-project-issue-type.dto';
import { UpdateProjectIssueTypeDto } from './dto/update-project-issue-type.dto';
import { detailProjectIssueTypeSchema, listProjectIssueTypeSchema } from './issue-type.schema';
import { IssueTypeService } from './issue-type.service';

@ClientControllers('project/issue-type')
@Project()
export class IssueTypeController {
  constructor(private readonly issueTypeService: IssueTypeService) {}

  @Get('list')
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectIssueType))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List project issue type',
  })
  @ApiResponse(listProjectIssueTypeSchema)
  async listProjectIssueType(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Query(AssignPagingPipe) query: ListProjectIssueTypeDto,
  ) {
    return this.issueTypeService.listProjectIssueType(user.id, req.projectId, query);
  }

  @Patch('update')
  @CheckPolicies(new PolicyHandlerCustom(Action.Update, Subject.ProjectIssueType))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Pm update project issue type',
  })
  @ApiResponse(BasicResponseExample)
  async updateProjectIssueType(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Body() body: UpdateProjectIssueTypeDto,
  ) {
    return this.issueTypeService.updateProjectIssueType(user.id, req.projectId, body);
  }

  @Post('create')
  @CheckPolicies(new PolicyHandlerCustom(Action.Create, Subject.ProjectIssueType))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create project issue type',
  })
  @ApiResponse(BasicResponseExample)
  async createProjectIssueType(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Body() body: CreateProjectIssueTypeDto,
  ) {
    return this.issueTypeService.createProjectIssueType(user.id, req.projectId, body);
  }

  @Get('detail/:issueTypeId')
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectIssueType))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Detail project issue type',
  })
  @ApiResponse(detailProjectIssueTypeSchema)
  async detailProjectIssueType(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Param('issueTypeId', CustomParseIntPipe) issueTypeId: number,
  ) {
    return this.issueTypeService.detailProjectIssueType(user.id, req.projectId, issueTypeId);
  }
}

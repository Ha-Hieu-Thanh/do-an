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
import { CreateProjectIssueCategoryDto } from './dto/create-project-issue-category.dto';
import { ListProjectIssueCategoryDto } from './dto/list-project-issue-category.dto';
import { UpdateProjectIssueCategoryDto } from './dto/update-project-issue-type.dto';
import { detailProjectIssueCategorySchema, listProjectIssueCategorySchema } from './issue-category.schema';
import { IssueCategoryService } from './issue-category.service';

@ClientControllers('project/issue-category')
@Project()
export class IssueCategoryController {
  constructor(private readonly issueCategoryService: IssueCategoryService) {}

  @Get('list')
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectIssueCategory))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List project issue category',
  })
  @ApiResponse(listProjectIssueCategorySchema)
  async listProjectIssueCategory(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Query(AssignPagingPipe) query: ListProjectIssueCategoryDto,
  ) {
    return this.issueCategoryService.listProjectIssueCategory(user.id, req.projectId, query);
  }

  @Post('create')
  @CheckPolicies(new PolicyHandlerCustom(Action.Create, Subject.ProjectIssueCategory))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create project issue category',
  })
  @ApiResponse(BasicResponseExample)
  async createProjectIssueCategory(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Body() body: CreateProjectIssueCategoryDto,
  ) {
    return this.issueCategoryService.createProjectIssueCategory(user.id, req.projectId, body);
  }

  @Get('detail/:issueCategoryId')
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectIssueCategory))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Detail project issue category',
  })
  @ApiResponse(detailProjectIssueCategorySchema)
  async detailProjectIssueCategory(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Param('issueCategoryId', CustomParseIntPipe) issueCategoryId: number,
  ) {
    return this.issueCategoryService.detailProjectIssueCategory(user.id, req.projectId, issueCategoryId);
  }

  @Patch('update')
  @CheckPolicies(new PolicyHandlerCustom(Action.Update, Subject.ProjectIssueCategory))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Pm update project issue category',
  })
  @ApiResponse(BasicResponseExample)
  async updateProjectIssueCategory(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Body() body: UpdateProjectIssueCategoryDto,
  ) {
    return this.issueCategoryService.updateProjectIssueCategory(user.id, req.projectId, body);
  }
}

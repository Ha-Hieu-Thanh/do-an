import { Action, Subject } from '@app/authorization';
import { Project } from '@app/core/decorator/api-project.decorator';
import { CheckPolicies, PolicyHandlerCustom } from '@app/core/decorator/check-policies.decorator';
import { ClientControllers } from '@app/core/decorator/controller-customer.decorator';
import { UserData } from '@app/core/decorator/user.decorator';
import { Exception } from '@app/core/exception';
import { AssignPagingPipe, CustomParseIntPipe } from '@app/core/pipes/validation.pipe';
import { Body, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ErrorCustom } from 'libs/constants/enum';
import { BasicResponseExample } from 'libs/constants/schema';
import { CreateIssueDto } from './dto/create-issue.dto';
import { ListProjectIssueHistoryDto } from './dto/list-project-issue-history.dto';
import { ListProjectIssueDto } from './dto/list-project-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { getDetailProjectIssueSchema, listIssueSchema } from './issue.schema';
import { IssueService } from './issue.service';
import { Public } from '@app/core/decorator/api-public.decorator';

@ClientControllers('project/issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post('search-with-elasticsearch')
  @Public()
  async listProjectIssueWithElasticsearch(@Body() body: ListProjectIssueDto) {
    return this.issueService.listProjectIssueWithElasticsearch(1, body);
  }

  @Get('/sync-mysql-to-es')
  @Public()
  async syncMySQLToELK() {
    return this.issueService.syncMySQLToELK();
  }

  @Post('create')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Create, Subject.ProjectIssue))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Client create issue project',
  })
  @ApiResponse(BasicResponseExample)
  async createIssue(@UserData() user: Express.User, @Body() body: CreateIssueDto, @Req() req: Request) {
    if (body.startDate && body.dueDate && body.startDate > body.dueDate) {
      throw new Exception(ErrorCustom.Invalid_Input_Date_Issue);
    }
    return this.issueService.createIssue(user.id, body, req.projectId);
  }

  @Get('list')
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectIssue))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List project issue',
  })
  @ApiResponse(listIssueSchema)
  async listProjectIssue(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Query(AssignPagingPipe) query: ListProjectIssueDto,
  ) {
    return this.issueService.listProjectIssue(user.id, query, req.projectId);
  }

  @Get('detail/:issueId')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectIssue))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Detail project issue',
  })
  @ApiResponse(getDetailProjectIssueSchema)
  async detailProject(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Param('issueId', CustomParseIntPipe) issueId: number,
  ) {
    return this.issueService.detailProjectIssue(user.id, req.projectId, issueId);
  }

  @Patch('update/:issueId')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Update, Subject.ProjectIssue))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Pm update project issue',
  })
  @ApiResponse(BasicResponseExample)
  async updateProjectIssue(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Body() body: UpdateIssueDto,
    @Param('issueId', CustomParseIntPipe) issueId: number,
  ) {
    return this.issueService.updateProjectIssue(user.id, req.projectId, req.userProjectRole, issueId, body);
  }

  @Get('history')
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectIssue))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List project issue history',
  })
  @ApiResponse(listIssueSchema)
  async listProjectIssueHistory(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Query(AssignPagingPipe) query: ListProjectIssueHistoryDto,
  ) {
    return this.issueService.listProjectIssueHistory(user.id, query, req.projectId);
  }

  @Get('list-gantt-chart')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectIssue))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List gantt chart issue',
  })
  // @ApiResponse(listIssueSchema)
  async listGanttChartIssue(@UserData() user: Express.User, @Req() req: Request, @Query() query: ListProjectIssueDto) {
    return this.issueService.listGanttChartIssue(user.id, query, req.projectId);
  }
}

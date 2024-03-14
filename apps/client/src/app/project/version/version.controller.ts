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
import { CreateProjectVersionDto } from './dto/create-project-version.dto';
import { ListProjectVersionDto } from './dto/list-project-version.dto';
import { UpdateProjectVersionDto } from './dto/update-project-version.dto';
import { detailProjectVersionSchema, listProjectVersionSchema } from './version.schema';
import { VersionService } from './version.service';

@ClientControllers('project/version')
@Project()
export class VersionController {
  constructor(private readonly VersionService: VersionService) {}

  @Get('list')
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectVersion))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List project version',
  })
  @ApiResponse(listProjectVersionSchema)
  async listProjectVersion(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Query(AssignPagingPipe) query: ListProjectVersionDto,
  ) {
    return this.VersionService.listProjectVersion(user.id, req.projectId, query);
  }

  @Post('create')
  @CheckPolicies(new PolicyHandlerCustom(Action.Create, Subject.ProjectVersion))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create project version',
  })
  @ApiResponse(BasicResponseExample)
  async createProjectVersion(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Body() body: CreateProjectVersionDto,
  ) {
    if (body.startDate >= body.endDate) throw new Exception(ErrorCustom.Invalid_Input);
    return this.VersionService.createProjectVersion(user.id, req.projectId, body);
  }

  @Get('detail/:versionId')
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectVersion))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Detail project version',
  })
  @ApiResponse(detailProjectVersionSchema)
  async detailProjectVersion(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Param('versionId', CustomParseIntPipe) versionId: number,
  ) {
    return this.VersionService.detailProjectVersion(user.id, req.projectId, versionId);
  }

  @Patch('update')
  @CheckPolicies(new PolicyHandlerCustom(Action.Update, Subject.ProjectIssueType))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Pm update project version',
  })
  @ApiResponse(BasicResponseExample)
  async updateProjectVersionType(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Body() body: UpdateProjectVersionDto,
  ) {
    return this.VersionService.updateProjectVersionType(user.id, req.projectId, body);
  }
}

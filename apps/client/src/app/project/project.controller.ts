import { Action, Subject } from '@app/authorization';
import { Project } from '@app/core/decorator/api-project.decorator';
import { CheckPolicies, PolicyHandlerCustom } from '@app/core/decorator/check-policies.decorator';
import { ClientControllers } from '@app/core/decorator/controller-customer.decorator';
import { UserData } from '@app/core/decorator/user.decorator';
import { AssignPagingPipe } from '@app/core/pipes/validation.pipe';
import { Body, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { BasicResponseExample } from 'libs/constants/schema';
import { ConfirmRequestJoinProjectDto } from './dto/confirm-request-join-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetMyProjectsDto } from './dto/get-my-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { createProjectSchema, getDetailProjectSchema, getMyProjectsSchema } from './project.schema';
import { ProjectService } from './project.service';
import { GenerateKeyDto } from './dto/generate-key.dto';
@ClientControllers('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Client create project',
  })
  @ApiResponse(createProjectSchema)
  async createProject(@UserData() user: Express.User, @Body() body: CreateProjectDto) {
    return this.projectService.createProject(user.id, body);
  }

  @Post('generate-key')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Auto generate key',
  })
  @ApiResponse(createProjectSchema)
  async generateKey(@UserData() user: Express.User, @Body() body: GenerateKeyDto) {
    return this.projectService.generateKey(user.id, body);
  }

  @Patch('update')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Update, Subject.Project))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update project',
  })
  @ApiResponse(BasicResponseExample)
  async updateProject(@UserData() user: Express.User, @Body() body: UpdateProjectDto, @Req() req: Request) {
    return this.projectService.updateProject(user.id, req.projectId, body);
  }

  @Get('get-my-projects')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Client get my project',
  })
  @ApiResponse(getMyProjectsSchema)
  async getMyProjects(@UserData() user: Express.User, @Query(AssignPagingPipe) query: GetMyProjectsDto) {
    return this.projectService.getMyProjects(user.id, query);
  }

  @Get('detail')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.Project))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Detail project',
  })
  @ApiResponse(getDetailProjectSchema)
  async detailProject(@UserData() user: Express.User, @Req() req: Request) {
    return this.projectService.detailProject(user.id, req.projectId);
  }

  @Patch('confirm-request-join-project')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update project',
  })
  @ApiResponse(BasicResponseExample)
  async confirmRequestJoinProject(@UserData() user: Express.User, @Body() body: ConfirmRequestJoinProjectDto) {
    return this.projectService.confirmRequestJoinProject(user.id, body);
  }
}

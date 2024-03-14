import { Action, Subject } from '@app/authorization';
import { Project } from '@app/core/decorator/api-project.decorator';
import { CheckPolicies, PolicyHandlerCustom } from '@app/core/decorator/check-policies.decorator';
import { ClientControllers } from '@app/core/decorator/controller-customer.decorator';
import { UserData } from '@app/core/decorator/user.decorator';
import { AssignPagingPipe, CustomParseIntPipe } from '@app/core/pipes/validation.pipe';
import { Body, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { BasicResponseExample } from 'libs/constants/schema';
import { CreateWikiProjectDto } from './dto/create-wiki-project.dto';
import { ListWikiProjectDto } from './dto/list-wiki-project.dto';
import { UpdateWikiProjectDto } from './dto/update-wiki-project.dto';
import { detailWikiProjectSchema, listWikiProjectSchema } from './wiki.schema';
import { WikiService } from './wiki.service';

@ClientControllers('project/wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Post('create')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Create, Subject.ProjectWiki))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Client create wiki project',
  })
  @ApiResponse(BasicResponseExample)
  async createWikiProject(@UserData() user: Express.User, @Req() req: Request, @Body() body: CreateWikiProjectDto) {
    return this.wikiService.create(user.id, req.projectId, body);
  }

  @Get('list')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectWiki))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List wiki project',
  })
  @ApiResponse(listWikiProjectSchema)
  async listWikiProject(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Query(AssignPagingPipe) query: ListWikiProjectDto,
  ) {
    return this.wikiService.list(user.id, req.projectId, query);
  }

  @Get('detail/:wikiId')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectWiki))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Detail wiki project',
  })
  @ApiResponse(detailWikiProjectSchema)
  async detailWikiProject(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Param('wikiId', CustomParseIntPipe) wikiId: number,
  ) {
    return this.wikiService.detail(user.id, req.projectId, wikiId);
  }

  @Put('update/:wikiId')
  @Project()
  @CheckPolicies(new PolicyHandlerCustom(Action.Update, Subject.ProjectWiki))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'update wiki project',
  })
  @ApiResponse(BasicResponseExample)
  async updateWikiProject(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Body() body: UpdateWikiProjectDto,
    @Param('wikiId', CustomParseIntPipe) wikiId: number,
  ) {
    return this.wikiService.update(user.id, req.projectId, wikiId, body);
  }
}

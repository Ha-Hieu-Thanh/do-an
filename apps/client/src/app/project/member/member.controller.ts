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
import { AddMemberProjectDto } from './dto/add-member-project.dto';
import { ListMembersProjectDto } from './dto/list-project-member.dto';
import { UpdateMemberProjectDto } from './dto/update-member-project.dto';
import { listMembersProjectSchema } from './member.schema';
import { MemberService } from './member.service';

@ClientControllers('project/member')
@Project()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('list')
  @CheckPolicies(new PolicyHandlerCustom(Action.Read, Subject.ProjectMember))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List member project',
  })
  @ApiResponse(listMembersProjectSchema)
  async listMembersProject(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Query(AssignPagingPipe) query: ListMembersProjectDto,
  ) {
    return this.memberService.listMembersProject(user.id, req.projectId, query);
  }

  @Post('add')
  @CheckPolicies(new PolicyHandlerCustom(Action.Create, Subject.ProjectMember))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Pm add member project',
  })
  @ApiResponse(BasicResponseExample)
  async addMemberProject(@UserData() user: Express.User, @Req() req: Request, @Body() body: AddMemberProjectDto) {
    return this.memberService.addMemberProject(user.id, req.projectId, body);
  }

  @Patch('update')
  @CheckPolicies(new PolicyHandlerCustom(Action.Update, Subject.ProjectMember))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Pm update member project',
  })
  @ApiResponse(BasicResponseExample)
  async updateMemberProject(@UserData() user: Express.User, @Req() req: Request, @Body() body: UpdateMemberProjectDto) {
    return this.memberService.updateMemberProject(user.id, req.projectId, body);
  }
}

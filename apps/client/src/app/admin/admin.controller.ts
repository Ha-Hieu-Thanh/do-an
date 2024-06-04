import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from '@app/core/decorator/api-admin.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserData } from '@app/core/decorator/user.decorator';
import { EditUserDto } from './dto/edit-user.dto';
import { AssignPagingPipe } from '@app/core/pipes/validation.pipe';
import { ListUserDto } from './dto/list-user.dto';
import { ListProjectDto } from './dto/list-project.dto';
import { AdminControllers } from '@app/core/decorator/controller-customer.decorator';

@AdminControllers()
@Admin()
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // API get list user in system
  @Get('/list-user')
  async listUser(@Query(AssignPagingPipe) query: ListUserDto) {
    return this.adminService.listUser(query);
  }

  // API get list project in system
  @Get('/list-project')
  async listProject(@Query(AssignPagingPipe) query: ListProjectDto) {
    return this.adminService.listProject(query);
  }

  // API edit user by user_id
  @Patch('/edit-user/:userId')
  async editUser(@UserData() admin: Express.User, @Body() body: EditUserDto, @Param('userId') userId: number) {
    return this.adminService.editUser(admin.id, body, userId);
  }
}

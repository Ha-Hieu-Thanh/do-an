import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ClientControllers } from '@app/core/decorator/controller-customer.decorator';
import { UserData } from '@app/core/decorator/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetMyProfileResponseSchema } from './profile.schema';
import { BasicResponseExample } from 'libs/constants/schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ClientControllers('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('my-profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Client get my profile',
  })
  @ApiResponse(GetMyProfileResponseSchema)
  async myProfile(@UserData() user: Express.User) {
    return this.profileService.myProfile(user.id);
  }

  @Patch('update')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update project',
  })
  @ApiResponse(BasicResponseExample)
  async updateProject(@UserData() user: Express.User, @Body() body: UpdateProfileDto) {
    return this.profileService.updateProfile(user.id, body);
  }
}

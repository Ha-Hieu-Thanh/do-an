import { ClientControllers } from '@app/core/decorator/controller-customer.decorator';
import { IRequest } from '@app/core/filters/http-exeption.filter';
import { Get, Req, Post, UseInterceptors, UploadedFiles, Inject, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@app/core/decorator/api-public.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BasicResponseExample } from 'libs/constants/schema';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { MessagePattern } from '@nestjs/microservices/decorators';
import { ServiceName } from 'libs/constants/enum';
import { UserData } from '@app/core/decorator/user.decorator';
import { AssignLoadMore, AssignPagingPipe } from '@app/core/pipes/validation.pipe';
import { Request } from 'express';
import { GetListNotificationSchema, CountNotificationUnreadSchema } from './app.schema';
import { GetListNotificationDto } from './dto/list-notification.dto';
import { ReadNotificationsDto } from './dto/read-notifications.dto';
@ClientControllers('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health-check')
  healthCheck(@Req() req: IRequest) {
    return this.appService.healthCheck(req.ip);
  }

  @Post('upload-file')
  @ApiOperation({
    summary: 'upload file',
    description: '',
  })
  @ApiResponse(BasicResponseExample)
  @ApiBearerAuth()
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>): Promise<any> {
    return this.appService.uploadFiles(files);
  }

  @Get('list-notification')
  @ApiOperation({
    summary: 'list notifications',
    description: '',
  })
  @ApiResponse(GetListNotificationSchema)
  @ApiBearerAuth()
  async getListNotification(
    @UserData() user: Express.User,
    @Req() req: Request,
    @Query(AssignPagingPipe) query: GetListNotificationDto,
  ) {
    return this.appService.getListNotification(user.id, query);
  }

  @Get('count-notification-unread')
  @ApiOperation({
    summary: 'count noti unread',
    description: '',
  })
  @ApiResponse(CountNotificationUnreadSchema)
  @ApiBearerAuth()
  async getCountNotiUnread(@UserData() user: Express.User) {
    return this.appService.getCountNotiUnread(user.id);
  }

  @Post('read-notification')
  @ApiOperation({
    summary: 'read notification',
    description: '',
  })
  @ApiResponse(BasicResponseExample)
  @ApiBearerAuth()
  @UseInterceptors()
  async readNotification(@UserData() user: Express.User, @Body() body: ReadNotificationsDto) {
    return this.appService.readNotifications(user.id, body);
  }
}

import { ClientControllers } from '@app/core/decorator/controller-customer.decorator';
import { AuthService } from './auth.service';
import { Body, Post } from '@nestjs/common';
import { Public } from '@app/core/decorator/api-public.decorator';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LoginCmsResponseSchema, RequestAccessTokenSchema } from './auth.schema';
import { ClientLoginDto } from './dto/login.dto';
import { ClientRegisterDto } from './dto/register.dto';
import { BasicResponseExample } from 'libs/constants/schema';
import { ClientVerifyRegisterDto } from './dto/verify-register.dto';
import { RequestAccessTokenDto } from './dto/request-access-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserData } from '@app/core/decorator/user.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmForgotPasswordDto } from './dto/confirm-forgot-password.dto';

@ClientControllers('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiResponse(LoginCmsResponseSchema)
  login(@Body() body: ClientLoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  @Public()
  @ApiResponse(BasicResponseExample)
  register(@Body() body: ClientRegisterDto) {
    return this.authService.register(body);
  }

  @Post('verify-register')
  @Public()
  @ApiResponse(LoginCmsResponseSchema)
  verifyRegister(@Body() body: ClientVerifyRegisterDto) {
    return this.authService.verifyRegister(body);
  }

  @Post('/request-access-token')
  @Public()
  @ApiResponse(RequestAccessTokenSchema)
  requestAccessToken(@Body() body: RequestAccessTokenDto) {
    return this.authService.requestAccessToken(body.refreshToken);
  }

  @Post('/change-password')
  @ApiResponse(BasicResponseExample)
  @ApiBearerAuth()
  changePassword(@UserData() user: Express.User, @Body() body: ChangePasswordDto) {
    if (body.password === body.newPassword) return;

    return this.authService.changePassword(user.id, body);
  }

  @Post('/forgot-password')
  @ApiResponse(BasicResponseExample)
  @Public()
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @Post('/confirm-forgot-password')
  @ApiResponse(BasicResponseExample)
  @Public()
  confirmForgotPassword(@Body() body: ConfirmForgotPasswordDto) {
    return this.authService.confirmForgotPassword(body);
  }
}

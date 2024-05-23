import { Exception } from '@app/core/exception';
import { IPayloadToken, IToken } from '@app/core/types';
import User from '@app/database-type-orm/entities/task-manager/User';
import { IConfigAuth } from '@app/helpers/config-env/configuration';
import { UtilsService } from '@app/helpers/utils/utils.service';
import { JwtAuthenticationService } from '@app/jwt-authentication';
import { QueueService } from '@app/queue';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  ClientLoginType,
  ErrorCustom,
  MailType,
  NotificationContent,
  NotificationTargetType,
  NotificationTitle,
  NotificationType,
  UserStatus,
} from 'libs/constants/enum';
import * as moment from 'moment';
import { DataSource, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmForgotPasswordDto } from './dto/confirm-forgot-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ClientLoginDto } from './dto/login.dto';
import { ClientRegisterDto } from './dto/register.dto';
import { ClientVerifyRegisterDto } from './dto/verify-register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly JwtAuthenticationService: JwtAuthenticationService,
    private readonly dataSource: DataSource,
    private readonly utilsService: UtilsService,
    private readonly configService: ConfigService,
    private readonly queueService: QueueService,
  ) {}

  async login(params: ClientLoginDto): Promise<IToken> {
    /* ------------------------ Login with email password ----------------------- */
    if (params.loginType === ClientLoginType.DEFAULT) {
      return await this.handleLogicClientLoginDefault(params);
    }

    /* ----------------------------- Login with ssn ----------------------------- */
    return await this.handleLoginClientLoginOther(params);
  }

  async register({ email, password }: ClientRegisterDto) {
    /* -------------------------- Check user in system -------------------------- */
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'status'],
    });

    if (user?.status === UserStatus.PENDING) {
      throw new Exception(ErrorCustom.Email_User_Already_Account_Pending, 'Tài khoản đã đăng kí và đang đợi xác thực');
    }

    if (user) {
      throw new Exception(ErrorCustom.Email_User_Already_Account, 'Tài khoản đã đăng kí');
    }

    return await this.dataSource.transaction(async (transaction) => {
      const userRepository = transaction.getRepository(User);
      const configAuth = this.configService.get<IConfigAuth>('auth');

      const inviteCode = this.utilsService.randomString(64);
      const hashInviteCode = await bcrypt.hash(inviteCode, configAuth?.saltRound);

      const hashPassword = await bcrypt.hash(password, configAuth?.saltRound);

      const newUser = await userRepository.save(<User>{
        email,
        password: hashPassword,
        status: UserStatus.PENDING,
        inviteCode: hashInviteCode,
      });

      /* ------------------------- Send mail user register ------------------------ */
      this.queueService.addSendMailQueue({
        receiversEmail: [newUser.email],
        type: MailType.Client_Register_Account,
        metadata: {
          link: this.buildLinkRegister(`${inviteCode}.${email}`),
        },
      });

      return true;
    });
  }

  async verifyRegister(params: ClientVerifyRegisterDto) {
    const { inviteCode, email } = this.handleInviteCode(params.inviteCode);

    /* --------------------------- Validate inviteCode -------------------------- */
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'status', 'inviteCode'],
    });

    if (!user || user.status !== UserStatus.PENDING) {
      throw new Exception(ErrorCustom.Invalid_Input);
    }

    const isInviteCodeCorrect = await bcrypt.compare(inviteCode, user.inviteCode);
    if (!isInviteCodeCorrect) {
      throw new Exception(ErrorCustom.Invite_Code_Invalid_Input, 'Mã truyền vào sai!');
    }

    this.queueService.addNotification({
      receiversId: [user.id],
      type: NotificationType.WelCome_First_Login,
      title: NotificationTitle.WelCome_First_Login,
      content: NotificationContent.WelCome_First_Login,
      targetType: NotificationTargetType.CLIENT,
    });

    return await this.generateToken(user, { status: UserStatus.ACTIVE, inviteCode: null } as User);
  }

  async requestAccessToken(refreshToken: string): Promise<string> {
    const token = this.JwtAuthenticationService.verifyRefreshToken(refreshToken);

    if (!token) {
      throw new Exception(ErrorCustom.Invalid_Input, 'refresh token not valid');
    }

    const user = await this.userRepository.findOne({
      where: { id: token.id },
      select: ['id', 'status', 'refreshToken'],
    });

    // if (user?.status === UserStatus.IN_ACTIVE) {
    //   throw new Exception(ErrorCustom.Not_Found, 'user not available');
    // }

    if (user?.refreshToken !== refreshToken) {
      throw new Exception(ErrorCustom.Invalid_Input, 'refresh token to be change, login again');
    }

    const newAccessToken = this.JwtAuthenticationService.generateAccessToken(<IPayloadToken>{
      id: token.id,
      timeStamp: new Date().getTime(),
    });

    return newAccessToken;
  }

  buildLinkRegister(inviteCode: string) {
    return `${this.configService.get<string>('domainUser')}/sign-up?inviteCode=${inviteCode}`;
  }

  handleInviteCode(data: string) {
    return data.split(`.`).reduce(
      (acc, cur, index) => {
        if (index === 0) {
          acc.inviteCode = cur;
        }

        if (index === 1) {
          acc.email += cur;
        }

        if (index > 1) {
          acc.email += `.${cur}`;
        }
        return acc;
      },
      { inviteCode: '', email: '' },
    );
  }

  async handleLogicClientLoginDefault(params: ClientLoginDto) {
    const { email, password } = params;
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: ['id', 'email', 'password', 'status', 'refreshToken', 'role'],
    });

    if (!user) {
      throw new Exception(ErrorCustom.Email_Not_Found, 'Không tìm thấy email người dùng');
    }
    if (user.status === UserStatus.BLOCKED) {
      throw new Exception(ErrorCustom.User_Blocked, 'User blocked');
    }

    if (user.status === UserStatus.PENDING) {
      throw new Exception(ErrorCustom.Email_User_Already_Account_Pending, 'Tài khoản đã đăng kí và đang đợi xác thực');
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      throw new Exception(ErrorCustom.Email_Or_Password_Not_valid, 'Email hoặc mật khẩu không chính xác');
    }

    return await this.generateToken(user);
  }

  async generateToken(user, params?: User): Promise<IToken> {
    const payload: IPayloadToken = { id: user.id, timeStamp: new Date().getTime() };

    const token = this.JwtAuthenticationService.generateAccessToken(payload);

    const isValid = this.JwtAuthenticationService.verifyRefreshToken(user?.refreshToken);
    if (!isValid) {
      const newRefreshToken = this.JwtAuthenticationService.generateRefreshToken(payload);

      await this.userRepository.update(user.id, {
        refreshToken: newRefreshToken,
        ...params,
      });

      return { token, refreshToken: newRefreshToken };
    }
    return { token, refreshToken: user?.refreshToken };
  }

  async handleLoginClientLoginOther(params: ClientLoginDto): Promise<IToken> {
    return {
      token: '',
      refreshToken: '',
    };
  }

  async changePassword(userId: number, params: ChangePasswordDto) {
    const configAuth = this.configService.get<IConfigAuth>('auth');

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: ['id', 'email', 'password', 'status', 'refreshToken'],
    });

    if (!user) {
      throw new Exception(ErrorCustom.Email_Not_Found, 'Không tìm thấy email người dùng');
    }
    if (user.status === UserStatus.BLOCKED) {
      throw new Exception(ErrorCustom.User_Blocked, 'User blocked');
    }

    if (user.status === UserStatus.PENDING) {
      throw new Exception(ErrorCustom.Email_User_Already_Account_Pending, 'Tài khoản đã đăng kí và đang đợi xác thực');
    }

    const isCorrectPassword = await bcrypt.compare(params.password, user.password);
    if (!isCorrectPassword) {
      throw new Exception(ErrorCustom.Email_Or_Password_Not_valid, 'Email hoặc mật khẩu không chính xác');
    }

    const hashPassword = await bcrypt.hash(params.newPassword, configAuth?.saltRound);

    await this.userRepository.update({ id: userId }, { password: hashPassword });

    return true;
  }

  validateDurationTimeTokenForgotPassword(timeStamp: number, isNewRequest = true) {
    const currentTime = new Date();

    const duration = moment(currentTime).diff(timeStamp, 'minutes');

    const timeCondition = 15;

    if (isNewRequest && duration <= timeCondition) {
      throw new Exception(
        ErrorCustom.Request_Duration_Time_Forgot_Password,
        `Thời gian request quên mật khẩu phải cách nhau ${timeCondition} minutes`,
      );
    }
    if (!isNewRequest && duration > timeCondition) {
      throw new Exception(
        ErrorCustom.Token_Forgot_Password_Expired,
        `Token chỉ có hạn sử dụng trong ${timeCondition} minutes`,
      );
    }
  }
  async forgotPassword(params: ForgotPasswordDto) {
    const { email } = params;
    const configAuth = this.configService.get<IConfigAuth>('auth');

    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: ['id', 'email', 'password', 'status', 'refreshToken', 'tokenForgotPassword', 'lastTimeForgotPassword'],
    });

    if (!user) {
      throw new Exception(ErrorCustom.Email_Not_Found, 'Không tìm thấy email người dùng');
    }
    if (user.status === UserStatus.BLOCKED) {
      throw new Exception(ErrorCustom.User_Blocked, 'User blocked');
    }

    if (user.status === UserStatus.PENDING) {
      throw new Exception(ErrorCustom.Email_User_Already_Account_Pending, 'Tài khoản đã đăng kí và đang đợi xác thực');
    }

    if (user.tokenForgotPassword && user.lastTimeForgotPassword) {
      this.validateDurationTimeTokenForgotPassword(Number(user.lastTimeForgotPassword));
    }

    const dataForgotPassword = {
      email,
      timeStamp: new Date().getTime(),
      id: user.id,
    };

    const tokenForgotPassword = this.JwtAuthenticationService.generateTokenForgotPassword(dataForgotPassword);
    const hashTokenForgotPassword = await bcrypt.hash(tokenForgotPassword, configAuth?.saltRound);

    await this.userRepository.update(
      { id: user.id },
      { tokenForgotPassword: hashTokenForgotPassword, lastTimeForgotPassword: String(dataForgotPassword.timeStamp) },
    );

    /* ------------------------- Send mail user register ------------------------ */
    this.queueService.addSendMailQueue({
      receiversEmail: [email],
      type: MailType.Client_Forgot_Password,
      metadata: {
        link: this.buildLinkForgotPassword(tokenForgotPassword, email),
      },
    });

    return true;
  }

  buildLinkForgotPassword(inviteCode: string, email: string) {
    return `${this.configService.get<IConfigAuth>(
      'domainUser',
    )}/confirm-forgot-password?inviteCode=${inviteCode}&email=${email}`;
  }

  async confirmForgotPassword({ tokenForgotPassword, newPassword }: ConfirmForgotPasswordDto) {
    const configAuth = this.configService.get<IConfigAuth>('auth');

    const dataDecode = this.JwtAuthenticationService.verifyAccessToken(tokenForgotPassword);

    if (!dataDecode) {
      throw new Exception(ErrorCustom.Invalid_Input);
    }

    this.validateDurationTimeTokenForgotPassword(dataDecode.timeStamp, false);

    const user = await this.userRepository.findOne({
      where: {
        id: dataDecode.id,
      },
      select: ['id', 'email', 'password', 'status', 'refreshToken', 'tokenForgotPassword'],
    });

    if (!user) {
      throw new Exception(ErrorCustom.Email_Not_Found, 'Không tìm thấy email người dùng');
    }
    if (user.status === UserStatus.BLOCKED) {
      throw new Exception(ErrorCustom.User_Blocked, 'User blocked');
    }

    if (user.status === UserStatus.PENDING) {
      throw new Exception(ErrorCustom.Email_User_Already_Account_Pending, 'Tài khoản đã đăng kí và đang đợi xác thực');
    }

    const isTokenForgotPassword = await bcrypt.compare(tokenForgotPassword, user.tokenForgotPassword);
    if (!isTokenForgotPassword) {
      throw new Exception(ErrorCustom.Token_Forgot_Password_Not_Valid, 'Token forgot password not valid');
    }

    const hashPassword = await bcrypt.hash(newPassword, configAuth?.saltRound);

    await this.userRepository.update(
      { id: dataDecode.id },
      { password: hashPassword, tokenForgotPassword: null, lastTimeForgotPassword: null },
    );

    return true;
  }
}

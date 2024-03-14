import { Injectable, Inject, LiteralObject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MODULE_OPTIONS_TOKEN } from './jwt-authentication.module-definition';
import { JwtAuthenticationModuleOptions } from './jwt-authentication.interface';
import { Request } from 'express';
import { TokenType } from 'libs/constants/enum';
import { Unauthorized } from '@app/core/exception';
import { IDataTokenForgotPassword } from '@app/helpers/config-env/configuration';
@Injectable()
export class JwtAuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(MODULE_OPTIONS_TOKEN)
    public options: JwtAuthenticationModuleOptions,
  ) {}

  async validateRequest(request: Request) {
    const token = this.extractFromAuthHeaderByBearerToken(request);
    try {
      const decoded = this.jwtService.verify<LiteralObject>(token, {
        secret: this.options.secretOrKey,
        algorithms: ['HS256'],
      });

      Object.assign(request, { payload: decoded });
      return true;
    } catch (error) {
      throw new Unauthorized("Your authorization token isn't valid. Please login again!");
    }
  }

  extractFromAuthHeaderByBearerToken(req: Request) {
    const token = req.headers.authorization || '';
    return token.trim().replace('Bearer ', '');
  }

  public generateAccessToken(payload: LiteralObject): string {
    const timeStamp = new Date().getTime();
    return this.jwtService.sign(
      { ...payload, tokenType: TokenType.ACCESS_TOKEN, timeStamp },
      {
        secret: this.options.secretOrKey,
        expiresIn: this.options.accessTokenExpiredIn,
        algorithm: 'HS256',
      },
    );
  }

  public generateTokenForgotPassword(payload: LiteralObject): string {
    return this.jwtService.sign(payload, {
      secret: this.options.secretOrKey,
      expiresIn: this.options.accessTokenExpiredIn,
      algorithm: 'HS256',
    });
  }

  public generateRefreshToken(payload: LiteralObject): string {
    const timeStamp = new Date().getTime();
    return this.jwtService.sign(
      { ...payload, tokenType: TokenType.REFRESH_TOKEN, timeStamp },
      {
        secret: this.options.secretOrKey,
        expiresIn: this.options.refreshTokenExpiredIn,
        algorithm: 'HS256',
      },
    );
  }

  public verifyAccessToken(accessToken: string): IDataTokenForgotPassword | false {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: this.options.secretOrKey,
      });
      return payload;
    } catch (error) {
      return false;
    }
  }

  public verifyRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.options.secretOrKey,
      });
      return payload;
    } catch (error) {
      return false;
    }
  }
}

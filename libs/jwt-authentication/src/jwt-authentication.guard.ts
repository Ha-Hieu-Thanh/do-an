import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtAuthenticationService } from './jwt-authentication.service';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '@app/core/decorator/api-public.decorator';
@Injectable()
export class JwtAuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(JwtAuthenticationService)
    private readonly jwtAuthenticationService: JwtAuthenticationService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // const token = request.headers.authorization;
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    /* -------------------------------------------------------------------------- */
    /*                     You can implement custom logic here                    */
    /* -------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------- */
    /*                              End custom logic                              */
    /* -------------------------------------------------------------------------- */
    const user = this.jwtAuthenticationService.validateRequest(request);

    return user;
  }
}

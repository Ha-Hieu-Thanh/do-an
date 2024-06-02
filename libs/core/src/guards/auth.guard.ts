import { AbilityProject, Action, AuthorizationService, Subject } from '@app/authorization';
import { GlobalCacheService } from '@app/cache';
import { Forbidden } from '@app/core/exception';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserProjectStatus, UserRole, UserStatus } from 'libs/constants/enum';
import { IS_PUBLIC_KEY } from '../decorator/api-public.decorator';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../decorator/check-policies.decorator';
import { IS_PROJECT_KEY } from '../decorator/api-project.decorator';
import { IS_ADMIN_KEY } from '../decorator/api-admin.decorator';

@Injectable()
export class AuthGuardUrl implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly globalCacheService: GlobalCacheService,
    private authorizationService: AuthorizationService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const isProject = this.reflector.getAllAndOverride<boolean>(IS_PROJECT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const request = context.switchToHttp().getRequest<Request>() as Request;
    const user = request.payload;
    const url = request.url;
    const headers = request.headers;
    const projectId = Number(headers['projectid']);

    if (isProject && !projectId) {
      throw new Forbidden('Missing projectId in header');
    }
    request.projectId = projectId;

    const userInfo = await this.globalCacheService.getUserInfo(user.id);

    if (userInfo.status !== UserStatus.ACTIVE) {
      throw new Forbidden(`User Blocked`);
    }

    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [context.getHandler(), context.getClass()]);
    if (isAdmin) {
      if (userInfo.role !== UserRole.ADMIN) {
        throw new Forbidden(`User Not permission`);
      }
      return true;
    }

    if (isProject) {
      if (userInfo.role === UserRole.ADMIN) return true;

      const projectInfo = await this.globalCacheService.getProjectInfo(request.projectId);
      const userProject = projectInfo.userProjectByUserId[user.id];
      if (!userProject) throw new Forbidden(`User Not in project`);
      if (![UserProjectStatus.ACTIVE, UserProjectStatus.PENDING].includes(userProject.status)) {
        throw new Forbidden(`User project status not active`);
      }

      const ability = this.authorizationService.createAbilityForProject(userProject);

      const isPolicy = policyHandlers.every((handler) => this.execPolicyHandler(handler, ability));
      if (!isPolicy) {
        throw new Forbidden(`User Not permission with this project`);
      }

      request.userProjectRole = userProject.role;
    }

    return true;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AbilityProject) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}

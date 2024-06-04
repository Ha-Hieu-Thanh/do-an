import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const ClientControllers =
  (controllerName?: string): ClassDecorator =>
  (target: any) => {
    const url = `/${controllerName || ''}`;

    ApiTags(url)(target);
    Controller(url)(target);
  };

export const AdminControllers =
  (controllerName?: string): ClassDecorator =>
  (target: any) => {
    const url = `/admin/${controllerName || ''}`;

    ApiTags(url)(target);
    Controller(url)(target);
  };

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const ClientControllers =
  (controllerName?: string): ClassDecorator =>
  (target: any) => {
    const url = `client/${controllerName || ''}`;

    ApiTags(url)(target);
    Controller(url)(target);
  };

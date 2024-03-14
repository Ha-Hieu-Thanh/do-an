import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StartUrl } from 'libs/constants/enum';

export const ClientControllers =
  (controllerName?: string): ClassDecorator =>
  (target: any) => {
    const url = `${StartUrl.CLIENT}/${controllerName || ''}`;

    ApiTags(url)(target);
    Controller(url)(target);
  };

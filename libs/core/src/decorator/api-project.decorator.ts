import { SetMetadata } from '@nestjs/common';
export const IS_PROJECT_KEY = 'isProject';
/**
 * Mark this as the project API
 *
 * Put it before the method you want to ignore check authentication.
 */
export const Project = () => SetMetadata(IS_PROJECT_KEY, true);

import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_KEY = 'isAdmin';
/**
 * Mark this as the public API
 *
 * Put it before the method you want to ignore check authentication.
 */
export const Admin = () => SetMetadata(IS_ADMIN_KEY, true);

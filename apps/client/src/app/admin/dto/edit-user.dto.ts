import { IsEnum } from 'class-validator';
import { UserStatus } from 'libs/constants/enum';

export class EditUserDto {
  /**
   * status
   * @example '1'
   */
  @IsEnum([UserStatus.ACTIVE, UserStatus.BLOCKED])
  status: UserStatus.ACTIVE | UserStatus.BLOCKED;
}

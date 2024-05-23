import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserProjectRole } from 'libs/constants/enum';

export class AddMemberProjectDto {
  /**
   * Email add
   * @example hieuthanh4a2@gmail.com
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * role
   * @example 2
   */
  @IsNotEmpty()
  @IsEnum([UserProjectRole.STAFF, UserProjectRole.SUB_PM])
  role: UserProjectRole;
}

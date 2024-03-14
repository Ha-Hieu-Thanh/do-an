import { IsEnum, IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { UserProjectRole, UserProjectStatus } from 'libs/constants/enum';

export class UpdateMemberProjectDto {
  /**
   * user id
   * @example  2
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  userId: number;

  /**
   * status
   * @example 1
   */
  @IsOptional()
  @IsEnum([UserProjectStatus.IN_ACTIVE])
  status: UserProjectStatus;

  /**
   * role
   * @example 2
   */
  @IsOptional()
  @IsEnum([UserProjectRole.STAFF, UserProjectRole.SUB_PM])
  role?: UserProjectRole;
}

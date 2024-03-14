import { IsEnum, IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { UserProjectStatus } from 'libs/constants/enum';

export class ConfirmRequestJoinProjectDto {
  /**
   * status
   * @example 2
   */
  @IsNotEmpty()
  @IsEnum([UserProjectStatus.ACTIVE, UserProjectStatus.REJECT])
  status: UserProjectStatus;

  /**
   * project id
   * @example  2
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectId: number;
}

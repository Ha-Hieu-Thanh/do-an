import { ArrayMinSize, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, Max, Min, ValidateIf } from 'class-validator';
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
  @IsEnum(UserProjectRole)
  role?: UserProjectRole;

  // if role is SUB_PM, then we need to add this field
  /**
   * categoryLeadIds
   * @type number[]
   * @example [1,2]
   */

  @ValidateIf((dto: UpdateMemberProjectDto) => dto.role === UserProjectRole.SUB_PM)
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  categoryIds?: number[];
}

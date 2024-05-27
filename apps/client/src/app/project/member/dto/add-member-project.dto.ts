import { ArrayMinSize, IsArray, IsEmail, IsEnum, IsInt, IsNotEmpty, Min, ValidateIf } from 'class-validator';
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
  @IsEnum(UserProjectRole)
  role: UserProjectRole;

  // if role is SUB_PM, then we need to add this field
  /**
   * categoryLeadIds
   * @type number[]
   * @example [1,2]
   */

  @ValidateIf((dto: AddMemberProjectDto) => dto.role === UserProjectRole.SUB_PM)
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  categoryIds?: number[];
}

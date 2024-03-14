import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ProjectIssueCategoryStatus } from 'libs/constants/enum';

export class UpdateProjectIssueCategoryDto {
  /**
   * Project issue Category id
   * @example  2
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectIssueCategoryId: number;

  /**
   * Project issue Category status
   * @example 1
   */
  @IsOptional()
  @IsEnum([ProjectIssueCategoryStatus.IN_ACTIVE])
  status?: ProjectIssueCategoryStatus;

  /**
   * pre id
   * @example  2
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectIssueCategoryPreId?: number;

  /**
   * post id
   * @example  2
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectIssueCategoryPostId?: number;

  /**
   * Project issue name
   * @example name
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name?: string;

  /**
   * Project issue description
   * @example name
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description?: string;
}

import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ProjectIssueTypeStatus } from 'libs/constants/enum';

export class UpdateProjectIssueTypeDto {
  /**
   * Project issue type id
   * @example  2
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectIssueTypeId: number;

  /**
   * Project issue type status
   * @example 1
   */
  @IsOptional()
  @IsEnum([ProjectIssueTypeStatus.IN_ACTIVE])
  status?: ProjectIssueTypeStatus;

  /**
   * pre id
   * @example  2
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectIssueTypePreId?: number;

  /**
   * post id
   * @example  2
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectIssueTypePostId?: number;

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
   * Project issue background color
   * @example name
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  backgroundColor?: string;

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

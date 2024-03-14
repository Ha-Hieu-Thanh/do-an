import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ProjectIssueStateStatus } from 'libs/constants/enum';

export class UpdateProjectIssueStateDto {
  /**
   * Project issue type id
   * @example  2
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectIssueStateId: number;

  /**
   * Project issue State status
   * @example 1
   */
  @IsOptional()
  @IsEnum([ProjectIssueStateStatus.IN_ACTIVE])
  status?: ProjectIssueStateStatus;

  /**
   * pre id
   * @example  2
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectIssueStatePreId?: number;

  /**
   * post id
   * @example  2
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectIssueStatePostId?: number;

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

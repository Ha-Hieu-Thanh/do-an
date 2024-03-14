import { IsDateCustom } from '@app/core/pipes/validation.pipe';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ProjectVersionStatus } from 'libs/constants/enum';

export class UpdateProjectVersionDto {
  /**
   * Project issue type id
   * @example  2
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectVersionId: number;

  /**
   * Project issue type status
   * @example 1
   */
  @IsOptional()
  @IsEnum([ProjectVersionStatus.IN_ACTIVE])
  status?: ProjectVersionStatus;

  /**
   * pre id
   * @example  2
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectVersionPreId?: number;

  /**
   * post id
   * @example  2
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  projectVersionPostId?: number;

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

  /**
   * Ngày bắt đầu yyyy-mm-dd (sẽ tính theo utc)=
   * @example 2025-09-11
   */
  @IsOptional()
  @IsDateCustom()
  startDate: string;

  /**
   * Ngày kết thúc yyyy-mm-dd (sẽ tính theo utc)=
   * @example 2025-09-11
   */
  @IsOptional()
  @IsDateCustom()
  endDate: string;
}

import { IsDateCustom } from '@app/core/pipes/validation.pipe';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  isNumber,
} from 'class-validator';
import { Priority } from 'libs/constants/enum';

export class CreateIssueDto {
  /**
   * type id
   * @example  2
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  typeId: number;

  /**
   * subject
   * @example subject
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  /**
   * description
   * @example description
   */
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  description?: string;

  /**
   * assignee id
   * @example  2
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  assigneeId: number;

  /**
   * priority
   * @example 1
   */
  @IsNotEmpty()
  @IsEnum(Priority)
  priority: Priority;

  /**
   * version
   * @example  2
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  versionId?: number;

  /**
   * category
   * @example  2
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  categoryId?: number;

  /**
   * Ngày bắt đầu yyyy-mm-dd (sẽ tính theo utc)=
   * @example 2025-09-11
   */
  @IsOptional()
  @IsDateCustom()
  startDate?: string;

  /**
   * Ngày kết thúc yyyy-mm-dd (sẽ tính theo utc)=
   * @example 2025-09-11
   */
  @IsOptional()
  @IsDateCustom({ isCheckNow: true })
  dueDate?: string;

  /**
   * Số giờ dự kiến
   * @example 1
   */
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  estimatedHours?: number;

  /**
   * Số giờ làm thực tế
   * @example 1
   */
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  actualHours?: number;
}

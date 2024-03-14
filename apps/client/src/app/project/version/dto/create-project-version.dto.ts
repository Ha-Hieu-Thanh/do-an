import { IsDateCustom } from '@app/core/pipes/validation.pipe';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectVersionDto {
  /**
   * Project issue name
   * @example name
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  /**
   * Ngày bắt đầu yyyy-mm-dd (sẽ tính theo utc)=
   * @example 2025-09-11
   */
  @IsDateCustom()
  startDate: string;

  /**
   * Ngày kết thúc yyyy-mm-dd (sẽ tính theo utc)=
   * @example 2025-09-11
   */
  @IsDateCustom()
  endDate: string;

  /**
   * Project issue description
   * @example description
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description?: string;
}

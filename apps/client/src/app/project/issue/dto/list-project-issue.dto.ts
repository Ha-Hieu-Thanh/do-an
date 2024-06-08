import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PageSizeDto } from 'libs/constants/pagination';

export class ListProjectIssueDto extends PageSizeDto {
  /**
   * type id
   * @example  2
   */
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  typeId?: number;

  /**
   * category
   * @example  2
   */
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  categoryId?: number;

  /**
   * version
   * @example  2
   */
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  versionId?: number;

  /**
   * assignee id
   * @example  2
   */
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  assigneeId: number;

  /**
   * stateIds
   * @example  [2]
   */
  @IsOptional()
  @Transform(({ value }) => value.map((item: any) => Number(item)))
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(18446744073709550, { each: true })
  stateIds?: number[];

  /**
   * is get all
   * @example 1
   */
  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  isGetAll?: boolean;

  /**
   * is my created
   * @example 1
   */
  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  isCreated?: boolean;

  /**
   * sortField
   * @param {string}
   * @example version_id
   */
  @IsOptional()
  @IsString()
  sortField?: string;
}

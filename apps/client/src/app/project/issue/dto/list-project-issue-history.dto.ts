import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { PageSizeDto } from 'libs/constants/pagination';

export class ListProjectIssueHistoryDto extends PageSizeDto {
  /**
   * category
   * @example  2
   */
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(18446744073709550)
  issueId?: number;
}

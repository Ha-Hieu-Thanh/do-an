import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ProjectState, ProjectStatus } from 'libs/constants/enum';
import { PageSizeDto } from 'libs/constants/pagination';

export class GetMyProjectsDto extends PageSizeDto {
  /**
   * status
   * @example 1
   */
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  /**
   * status
   * @example 1
   */
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsEnum(ProjectState)
  state?: ProjectState;
}

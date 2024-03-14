import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ProjectState, ProjectStatus } from 'libs/constants/enum';

export class UpdateProjectDto {
  /**
   * Project name
   * @example name
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name?: string;

  /**
   * Project key
   * @example key
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  key?: string;

  /**
   * Project avatar
   * @example avatar
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  avatar?: string;

  /**
   * state project
   * @example 1
   */
  @IsOptional()
  @IsEnum(ProjectState)
  state?: ProjectState;
}

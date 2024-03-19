import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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
}

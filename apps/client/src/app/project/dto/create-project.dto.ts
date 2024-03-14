import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  /**
   * Project name
   * @example name
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  /**
   * Project key
   * @example key
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  key: string;
}

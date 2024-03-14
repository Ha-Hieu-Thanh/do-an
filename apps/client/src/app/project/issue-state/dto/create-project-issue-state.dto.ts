import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectIssueStateDto {
  /**
   * Project issue name
   * @example name
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  /**
   * Project issue background color
   * @example backgroundColor
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  backgroundColor: string;

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

import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectIssueTypeDto {
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

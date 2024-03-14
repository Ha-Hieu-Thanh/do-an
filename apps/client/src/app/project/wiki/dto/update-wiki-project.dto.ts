import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateWikiProjectDto {
  /**
   * subject
   * @example subject
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  /**
   * content
   * @example content
   */
  @IsOptional()
  @IsString()
  @MaxLength(60000)
  content?: string;
}

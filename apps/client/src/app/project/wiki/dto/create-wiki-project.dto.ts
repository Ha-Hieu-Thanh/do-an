import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWikiProjectDto {
  /**
   * subject
   * @example subject
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  subject?: string;

  /**
   * content
   * @example content
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(60000)
  content?: string;
}

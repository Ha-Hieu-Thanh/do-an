import { ArrayMinSize, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  content?: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  files?: string[];
}

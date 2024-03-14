import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GenerateKeyDto {
  /**
   * Project name
   * @example name
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}

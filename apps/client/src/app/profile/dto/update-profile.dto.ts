import { IsDateCustom } from '@app/core/pipes/validation.pipe';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Gender } from 'libs/constants/enum';

export class UpdateProfileDto {
  /**
   * avatar
   * @example
   */
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  avatar?: string;

  /**
   * name
   * @example  Nguyen van a
   */
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  // @Validate(CustomValidateIsIsKatakana)
  name?: string;

  /**
   * phone
   * @example  0988348216
   */
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(15)
  phone?: string;

  /**
   * gender
   * @example 1
   */
  @IsOptional()
  @IsEnum([Gender.FEMALE, Gender.MALE])
  gender?: Gender;

  /**
   * staff address
   * @example Ha Noi
   */
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  address?: string;

  /**
   * birthday
   * @example 2025-09-11
   */
  @IsOptional()
  @IsDateCustom()
  birthday?: string;
}

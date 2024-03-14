import { CustomValidateIsPassword } from '@app/core/pipes/validation.pipe';
import { IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';

export class ChangePasswordDto {
  /**
   * your password login
   * @example 0Azhihahaxxxx
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Validate(CustomValidateIsPassword)
  password: string;

  /**
   * new password login
   * @example 0Azhihahaxxxx
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Validate(CustomValidateIsPassword)
  newPassword: string;
}

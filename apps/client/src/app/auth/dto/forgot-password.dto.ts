import { CustomValidateIsPassword } from '@app/core/pipes/validation.pipe';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';

export class ForgotPasswordDto {
  /**
   * Email forgot password
   * @example hien.tran@amela.vn
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

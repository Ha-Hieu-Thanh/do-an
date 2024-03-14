import { CustomValidateIsPassword } from '@app/core/pipes/validation.pipe';
import { IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';

export class ConfirmForgotPasswordDto {
  /**
   * your tokenForgotPassword verify
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhpZW4udHJhbkBhbWVsYS52biIsInRpbWVTdGFtcCI6MTY5NDc1MDIwMDg0MiwidXNlclR5cGUiOjIsImlkIjoyLCJpYXQiOjE2OTQ3NTAyMDAsImV4cCI6MTY5NTYxNDIwMH0.xJPFXpjvvHWAf05swmjq-8fGGQcxATtRySPINKWgYJw.hien.tran@amela.vn
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  tokenForgotPassword: string;

  /**
   * your password login
   * @example 0Azhihahaxxxx
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Validate(CustomValidateIsPassword)
  newPassword: string;
}

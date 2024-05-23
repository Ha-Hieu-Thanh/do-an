import { CustomValidateIsPassword } from '@app/core/pipes/validation.pipe';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';

export class ClientRegisterDto {
  /**
   * Email login
   * @example hieuthanh4a2@gmail.com
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

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
}

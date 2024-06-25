import { CustomValidateIsPassword } from '@app/core/pipes/validation.pipe';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
// import { ClientLoginType } from 'libs/constants/enum';
// export class DataSnsDto {
//   /**
//    * code
//    * @example 5X02N4dguwtljhOX0NvZ
//    */
//   @IsNotEmpty()
//   @IsString()
//   @MinLength(1)
//   code: string;

//   /**
//    * verifierCode
//    * @example 23HfmNkxlaikOt7kFdlqozgc1OKEb99c
//    */
//   @IsString()
//   @IsOptional()
//   @IsNotEmpty()
//   verifierCode?: string;
// }

export class ClientLoginDto {
  /**
   * type login client
   * @example 1
   */
  // @IsNotEmpty()
  // @IsEnum(ClientLoginType)
  // loginType: ClientLoginType;

  /**
   * Email login
   * @example hieuthanh4a2@gmail.com
   */
  // @ValidateIf((lcd: ClientLoginDto) => {
  //   return lcd.loginType === ClientLoginType.DEFAULT;
  // })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * your password login
   * @example 0Azhihahaxxxx
   */
  // @ValidateIf((lcd: ClientLoginDto) => {
  //   return lcd.loginType === ClientLoginType.DEFAULT;
  // })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Validate(CustomValidateIsPassword)
  password: string;

  /**
   * dataSns
   */
  // @ValidateIf((lcd: ClientLoginDto) => {
  //   return lcd.loginType !== ClientLoginType.DEFAULT;
  // })
  // @IsNotEmpty()
  // @ValidateNested()
  // @Type(() => DataSnsDto)
  // dataSns: DataSnsDto;
}

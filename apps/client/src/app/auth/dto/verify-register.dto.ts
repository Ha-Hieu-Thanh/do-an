import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ClientVerifyRegisterDto {
  /**
   * your inviteCode verify
   * @example jf702jEUmosn8KgRThMvCipdZG6Y7vdGxK14Om2WT5Y6g9vO70AH4J4QNgiV8txhtest.hieuthanh4a2@gmail.com
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  inviteCode: string;
}

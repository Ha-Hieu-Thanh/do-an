import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReadNotificationsDto {
  /**
   * nft id
   * @example  [1]
   */
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  notificationIds: number[];
}

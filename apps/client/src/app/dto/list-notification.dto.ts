import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ReadNotification } from 'libs/constants/enum';
import { PageSizeDto } from 'libs/constants/pagination';

export class GetListNotificationDto extends PageSizeDto {
  /**
   * isRead
   * @example 1
   */
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsEnum(ReadNotification)
  isRead?: ReadNotification;
}

import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class ReadNotificationsDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  notificationIds?: number[];

  @IsOptional()
  @IsBoolean()
  isReadAll?: boolean;
}

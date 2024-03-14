import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PageSizeDto {
  /**
   * @example  10
   */
  @ApiProperty({ required: false })
  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  skip?: number;
  /**
   * size in one page
   * @example 10
   */
  @ApiProperty({ required: false })
  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  pageSize?: number;

  /**
   * index page
   * @example 1
   */
  @ApiProperty({ required: false })
  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  pageIndex?: number;

  /**
   * keyword search
   * @example my keyword
   */
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    const result = value.replaceAll(/[%_]/g, (item: string) => {
      return `\\${item}`;
    });
    return result;
  })
  keyword?: string;
}
export class LoadMoreDto {
  /**
   * size in one page
   * @example 10
   */
  @ApiProperty({ required: false })
  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  pageSize?: number;

  /**
   * keyword search
   * @example my keyword
   */
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    const result = value.replaceAll(/[%_]/g, (item: string) => {
      return `\\${item}`;
    });
    return result;
  })
  keyword?: string;
}

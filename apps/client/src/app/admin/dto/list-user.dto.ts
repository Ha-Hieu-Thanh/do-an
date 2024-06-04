import { PageSizeDto } from 'libs/constants/pagination';

export class ListUserDto extends PageSizeDto {
  /**
   * keyword
   * @example 'keyword'
   */
  keyword?: string;
}

import { PageSizeDto } from 'libs/constants/pagination';

export class ListProjectDto extends PageSizeDto {
  /**
   * keyword
   * @example 'keyword'
   */
  keyword?: string;
}

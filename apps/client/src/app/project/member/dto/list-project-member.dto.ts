import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { UserProjectRole, UserProjectStatus } from 'libs/constants/enum';
import { PageSizeDto } from 'libs/constants/pagination';

export class ListMembersProjectDto extends PageSizeDto {
  /**
   * status
   * @example [1]
   */
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.map((item: any) => Number(item)))
  @IsEnum(UserProjectStatus, { each: true })
  status?: UserProjectStatus[];

  /**
   * role
   * @example 1
   */
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.map((item: any) => Number(item)))
  @IsEnum(UserProjectRole, { each: true })
  roles?: UserProjectRole[];
}

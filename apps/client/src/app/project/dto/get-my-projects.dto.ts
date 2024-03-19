import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PageSizeDto } from 'libs/constants/pagination';

export class GetMyProjectsDto extends PageSizeDto {}

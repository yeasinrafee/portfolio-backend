import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Status } from '../../../generated/prisma/enums';

export class QueryBlogDto extends PaginationDto {
  @ApiPropertyOptional({ enum: Status, example: Status.PUBLISHED })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ example: 'nextjs', description: 'Filter by tag' })
  @IsOptional()
  @IsString()
  tag?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Status } from '../../../generated/prisma/enums';

export enum BlogSortOption {
  LATEST = 'latest',
  OLDEST = 'oldest',
  POPULAR = 'popular',
}

export class QueryBlogDto extends PaginationDto {
  @ApiPropertyOptional({ enum: Status, example: Status.PUBLISHED })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    example: 'nextjs',
    description: 'Filter by a single tag',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    enum: BlogSortOption,
    example: BlogSortOption.LATEST,
    description:
      'Preset sort — overrides sortBy/sortOrder when provided. latest = newest first, oldest = oldest first, popular = most viewed first.',
  })
  @IsOptional()
  @IsEnum(BlogSortOption)
  sort?: BlogSortOption;
}

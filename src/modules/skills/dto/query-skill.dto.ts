/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QuerySkillDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'Frontend',
    description: 'Filter by category',
  })
  @IsOptional()
  @IsString()
  category?: string;
}

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Status } from '../../../generated/prisma/enums';

export class QueryProjectDto extends PaginationDto {
  @ApiPropertyOptional({ enum: Status, example: Status.PUBLISHED })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: 'Web App' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-...' })
  @IsOptional()
  @IsString()
  technologyId?: string;
}

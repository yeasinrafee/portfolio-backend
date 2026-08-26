/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUrl,
  IsEnum,
  IsInt,
  MaxLength,
  ArrayUnique,
  IsDate,
} from 'class-validator';
import { Status } from '../../../generated/prisma/enums';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({ example: 'Portfolio Dashboard', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    example:
      'A fully dynamic portfolio site with an admin dashboard built using Next.js and Nest.js.',
    description: 'Full project description (supports long text)',
  })
  @IsString()
  description!: string;

  @ApiPropertyOptional({
    example: 'Dynamic portfolio with admin panel',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  shortSummary?: string;

  @ApiPropertyOptional({
    example: [
      'https://cdn.example.com/img1.png',
      'https://cdn.example.com/img2.png',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 'https://myproject.live' })
  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/rafee/project' })
  @IsOptional()
  @IsUrl()
  repoUrl?: string;

  @ApiPropertyOptional({ example: 'Emperal Tech' })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional({ example: 'Web App' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({
    enum: Status,
    example: Status.DRAFT,
    default: Status.DRAFT,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2026-03-20' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({
    example: ['a1b2c3d4-...', 'e5f6g7h8-...'],
    description: 'Array of Technology IDs to link with this project',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  technologyIds?: string[];
}

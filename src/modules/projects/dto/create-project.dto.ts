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
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from '../../../generated/prisma/enums';

class ProjectImageDto {
  @ApiProperty({
    example:
      'https://res.cloudinary.com/demo/image/upload/v1/portfolio/images/abc.jpg',
  })
  @IsUrl()
  url!: string;

  @ApiPropertyOptional({
    example: 'Screenshot of the admin dashboard showing the projects list',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  alt?: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class CreateProjectDto {
  @ApiProperty({ example: 'Portfolio Dashboard', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    example: 'A fully dynamic portfolio site with an admin dashboard.',
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

  @ApiPropertyOptional({ type: [ProjectImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageDto)
  images?: ProjectImageDto[];

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
  startDate?: Date;

  @ApiPropertyOptional({ example: '2026-03-20' })
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({
    type: [String],
    description: 'Array of Technology IDs',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  technologyIds?: string[];

  @ApiPropertyOptional({
    example: 'Portfolio Dashboard | Rafee',
    maxLength: 70,
  })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  metaTitle?: string;

  @ApiPropertyOptional({
    example:
      'A fully dynamic portfolio with admin dashboard built with Next.js and Nest.js.',
    maxLength: 160,
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @ApiPropertyOptional({
    example: ['portfolio', 'nextjs', 'nestjs'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaKeywords?: string[];

  @ApiPropertyOptional({ example: 'https://cdn.example.com/og/project1.jpg' })
  @IsOptional()
  @IsUrl()
  ogImage?: string;

  @ApiPropertyOptional({
    example: 'https://myportfolio.com/projects/portfolio-dashboard',
  })
  @IsOptional()
  @IsUrl()
  canonicalUrl?: string;
}

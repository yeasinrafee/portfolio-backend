import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  MaxLength,
  ArrayUnique,
} from 'class-validator';
import { Status } from '../../../generated/prisma/enums';

export class CreateBlogDto {
  @ApiProperty({
    example: 'Building a Fully Dynamic Portfolio with Next.js and Nest.js',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    example:
      'A behind-the-scenes look at how I built my own portfolio dashboard.',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  excerpt?: string;

  @ApiProperty({
    example:
      '<p>This is the <strong>rich text</strong> content from the editor...</p>',
    description:
      'HTML content from the rich text editor. Sanitized on the server before saving.',
  })
  @IsString()
  content!: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/blog/cover1.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({
    example: ['nextjs', 'nestjs', 'prisma'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    enum: Status,
    example: Status.DRAFT,
    default: Status.DRAFT,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    example: 'Building a Portfolio | Rafee',
    maxLength: 70,
    description: 'SEO title tag',
  })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  metaTitle?: string;

  @ApiPropertyOptional({
    example:
      'Learn how a fully dynamic portfolio dashboard was built end-to-end.',
    maxLength: 160,
    description: 'SEO meta description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @ApiPropertyOptional({ example: 'A screenshot of the finished dashboard' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  coverImageAlt?: string;

  @ApiPropertyOptional({
    example: ['nextjs', 'portfolio', 'tutorial'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaKeywords?: string[];

  @ApiPropertyOptional({ example: 'https://cdn.example.com/og/blog1.jpg' })
  @IsOptional()
  @IsString()
  ogImage?: string;

  @ApiPropertyOptional({ example: 'https://myportfolio.com/blog/my-post' })
  @IsOptional()
  @IsString()
  canonicalUrl?: string;
}

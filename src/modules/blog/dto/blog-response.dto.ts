import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '../../../generated/prisma/enums';

export class BlogResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({
    example: 'Building a Fully Dynamic Portfolio with Next.js and Nest.js',
  })
  title!: string;

  @ApiProperty({
    example: 'building-a-fully-dynamic-portfolio-with-next-js-and-nest-js',
  })
  slug!: string;

  @ApiPropertyOptional({
    example: 'A behind-the-scenes look at how I built my portfolio.',
  })
  excerpt?: string;

  @ApiProperty({ example: '<p>Sanitized HTML content...</p>' })
  content!: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/blog/cover1.jpg' })
  coverImage?: string;

  @ApiProperty({ type: [String], example: ['nextjs', 'nestjs'] })
  tags!: string[];

  @ApiProperty({ enum: Status, example: Status.PUBLISHED })
  status!: Status;

  @ApiProperty({ example: 342 })
  viewCount!: number;

  @ApiPropertyOptional({
    example: 6,
    description: 'Estimated reading time in minutes',
  })
  readingTimeMins?: number;

  @ApiProperty({ example: '2026-08-20T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-25T14:30:00.000Z' })
  updatedAt!: Date;
}

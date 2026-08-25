/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '../../../generated/prisma/enums';

class TechnologyBriefDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }) id!: string;
  @ApiProperty({ example: 'Next.js' }) name!: string;
  @ApiPropertyOptional({ example: 'https://cdn.example.com/nextjs.svg' })
  icon?: string;
}

export class ProjectResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'Portfolio Dashboard' })
  title!: string;

  @ApiProperty({ example: 'portfolio-dashboard' })
  slug!: string;

  @ApiProperty({
    example: 'A fully dynamic portfolio site with an admin dashboard.',
  })
  description!: string;

  @ApiPropertyOptional({ example: 'Dynamic portfolio with admin panel' })
  shortSummary?: string;

  @ApiProperty({
    type: [String],
    example: ['https://cdn.example.com/img1.png'],
  })
  images!: string[];

  @ApiPropertyOptional({ example: 'https://myproject.live' })
  liveUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/rafee/project' })
  repoUrl?: string;

  @ApiProperty({ enum: Status, example: Status.PUBLISHED })
  status!: Status;

  @ApiProperty({ example: false })
  featured!: boolean;

  @ApiProperty({ example: 128 })
  viewCount!: number;

  @ApiProperty({ type: [TechnologyBriefDto] })
  technologies!: TechnologyBriefDto[];

  @ApiProperty({ example: '2026-08-20T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-25T14:30:00.000Z' })
  updatedAt!: Date;
}

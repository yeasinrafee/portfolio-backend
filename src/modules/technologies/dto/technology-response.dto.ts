import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TechnologyResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'Next.js' })
  name!: string;

  @ApiProperty({ example: 'next-js' })
  slug!: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/icons/nextjs.svg' })
  icon?: string;

  @ApiPropertyOptional({ example: 'Frontend' })
  category?: string;

  @ApiPropertyOptional({
    example: 'React framework used for server-rendered frontend',
  })
  description?: string;

  @ApiProperty({ example: 0 })
  order!: number;

  @ApiProperty({ example: '2026-08-20T10:00:00.000Z' })
  createdAt!: Date;
}

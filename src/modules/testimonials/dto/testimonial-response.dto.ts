import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TestimonialResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'John Carter' })
  name!: string;

  @ApiPropertyOptional({ example: 'CTO, Acme Inc.' })
  designation?: string;

  @ApiPropertyOptional({ example: 'Acme Inc.' })
  company?: string;

  @ApiProperty({ example: 'Rafee delivered an outstanding product on time.' })
  message!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/testimonials/john.jpg',
  })
  photo?: string;

  @ApiPropertyOptional({ example: 5 })
  rating?: number;

  @ApiProperty({ example: 0 })
  order!: number;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExperienceResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'Emperal Tech' })
  company!: string;

  @ApiPropertyOptional({ example: 'https://emperaltech.com' })
  companyUrl?: string;

  @ApiProperty({ example: 'Founder & CEO' })
  role!: string;

  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
  location?: string;

  @ApiProperty({
    example: 'Leading full-stack development and AI/ML initiatives.',
  })
  description!: string;

  @ApiProperty({ example: true })
  isCurrent!: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  startDate!: Date;

  @ApiPropertyOptional({ example: '2025-06-30T00:00:00.000Z' })
  endDate?: Date;

  @ApiProperty({ example: 0 })
  order!: number;
}

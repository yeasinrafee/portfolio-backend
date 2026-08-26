import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EducationResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'IUBAT' })
  institution!: string;

  @ApiProperty({ example: 'B.Sc. in Computer Science & Engineering' })
  degree!: string;

  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
  location?: string;

  @ApiProperty({ example: false })
  isCurrent!: boolean;

  @ApiProperty({ example: '2019-01-01T00:00:00.000Z' })
  startDate!: Date;

  @ApiPropertyOptional({ example: '2023-01-01T00:00:00.000Z' })
  endDate?: Date;

  @ApiProperty({ example: 0 })
  order!: number;
}

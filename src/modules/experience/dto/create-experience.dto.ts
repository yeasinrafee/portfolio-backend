import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsInt,
  MaxLength,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Emperal Tech', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  company!: string;

  @ApiProperty({ example: 'Founder & CEO', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  role!: string;

  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example:
      'Leading full-stack development, DevOps, and AI/ML initiatives for client projects.',
  })
  @IsString()
  description!: string;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'True if this is the current position',
  })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiProperty({ example: '2023-01-01' })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({
    example: '2025-06-30',
    description: 'Omit if isCurrent is true',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}

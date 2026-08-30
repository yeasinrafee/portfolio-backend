import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  IsInt,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Emperal Tech', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  company!: string;

  @ApiPropertyOptional({ example: 'https://emperaltech.com' })
  @IsOptional()
  @IsUrl()
  companyUrl?: string;

  @ApiProperty({ example: 'Founder & CEO', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  role!: string;

  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: 'Leading full-stack development, DevOps, and AI/ML initiatives.',
  })
  @IsString()
  description!: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiProperty({ example: '2023-01-01' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiPropertyOptional({ example: '2025-06-30' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}

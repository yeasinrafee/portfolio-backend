import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsInt,
  MaxLength,
} from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({ example: 'IUBAT', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  institution!: string;

  @ApiProperty({
    example: 'B.Sc. in Computer Science & Engineering',
    maxLength: 150,
  })
  @IsString()
  @MaxLength(150)
  degree!: string;

  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiProperty({ example: '2019-01-01' })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({ example: '2023-01-01' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}

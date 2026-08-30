import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  MaxLength,
  IsDate,
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

  @ApiPropertyOptional({
    example: 'Computer Science & Engineering',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  fieldOfStudy?: string;

  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example:
      'Graduated with honors. Led the university robotics club to a national championship.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiProperty({ example: '2019-01-01' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiPropertyOptional({ example: '2023-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}

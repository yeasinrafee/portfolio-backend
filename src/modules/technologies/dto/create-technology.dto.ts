/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';

export class CreateTechnologyDto {
  @ApiProperty({ example: 'Next.js', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/icons/nextjs.svg' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    example: 'Frontend',
    description: 'Grouping category e.g. Frontend, Backend, Database, DevOps',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({
    example: 'React framework used for server-rendered frontend',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}

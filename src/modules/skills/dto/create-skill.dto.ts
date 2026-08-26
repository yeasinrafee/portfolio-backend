/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'Next.js', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'Frontend',
    description:
      'Grouping category, e.g. Frontend, Backend, Database, DevOps, Tools',
  })
  @IsString()
  @MaxLength(50)
  category!: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/icons/nextjs.svg' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    example: 1,
    default: 0,
    description: 'Controls display order within a category',
  })
  @IsOptional()
  @IsInt()
  order?: number;
}

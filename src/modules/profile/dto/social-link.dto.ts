import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class SocialLinkDto {
  @ApiProperty({ example: 'GitHub', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  platform!: string;

  @ApiProperty({ example: 'https://github.com/rafee' })
  @IsUrl()
  url!: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/icons/github.svg' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

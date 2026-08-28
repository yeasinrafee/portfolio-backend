import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SocialLinkDto } from './social-link.dto';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Yeasin Rafee', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'Full-stack Developer & Tech Entrepreneur',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  shortDescription?: string;

  @ApiPropertyOptional({
    example:
      'I build software products, lead engineering teams, and explore AI/ML...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example:
      'https://res.cloudinary.com/demo/image/upload/v1/portfolio/images/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    example: 'Currently building AI-powered chatbots at Emperal Tech',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  currentStatus?: string;

  @ApiPropertyOptional({ example: 'rafee@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+8801XXXXXXXXX' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  primaryPhone?: string;

  @ApiPropertyOptional({ example: '+8801YYYYYYYYY' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  secondaryPhone?: string;

  @ApiPropertyOptional({ example: 'House 12, Road 5, Dhanmondi, Dhaka' })
  @IsOptional()
  @IsString()
  presentAddress?: string;

  @ApiPropertyOptional({ example: 'Village Road, Barishal' })
  @IsOptional()
  @IsString()
  permanentAddress?: string;

  @ApiPropertyOptional({
    type: [SocialLinkDto],
    description:
      'Full list of social links — sending this replaces all existing links',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SocialLinkResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }) id!: string;
  @ApiProperty({ example: 'GitHub' }) platform!: string;
  @ApiProperty({ example: 'https://github.com/rafee' }) url!: string;
  @ApiPropertyOptional({ example: 'https://cdn.example.com/icons/github.svg' })
  icon?: string;
  @ApiProperty({ example: 0 }) order!: number;
}

export class ProfileResponseDto {
  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id?: string;
  @ApiPropertyOptional({ example: 'Yeasin Rafee' }) name?: string;
  @ApiPropertyOptional({ example: 'Full-stack Developer & Tech Entrepreneur' })
  shortDescription?: string;
  @ApiPropertyOptional({ example: 'Full bio text...' }) description?: string;
  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.jpg' })
  avatar?: string;
  @ApiPropertyOptional({ example: 'Currently building AI-powered tools' })
  currentStatus?: string;
  @ApiPropertyOptional({ example: 'rafee@example.com' }) email?: string;
  @ApiPropertyOptional({ example: '+8801XXXXXXXXX' }) primaryPhone?: string;
  @ApiPropertyOptional({ example: '+8801YYYYYYYYY' }) secondaryPhone?: string;
  @ApiPropertyOptional({ example: 'Dhanmondi, Dhaka' }) presentAddress?: string;
  @ApiPropertyOptional({ example: 'Barishal' }) permanentAddress?: string;
  @ApiProperty({ type: [SocialLinkResponseDto] })
  socialLinks!: SocialLinkResponseDto[];
}

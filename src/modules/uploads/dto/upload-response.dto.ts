import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/images/abc123.jpg',
  })
  url!: string;

  @ApiProperty({ example: 'portfolio/images/abc123' })
  publicId!: string;

  @ApiProperty({ example: 'image', enum: ['image', 'raw'] })
  resourceType!: string;

  @ApiPropertyOptional({ example: 245678, description: 'File size in bytes' })
  bytes?: number;

  @ApiPropertyOptional({ example: 'jpg' })
  format?: string;
}

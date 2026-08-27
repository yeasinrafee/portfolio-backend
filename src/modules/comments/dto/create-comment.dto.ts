import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Great write-up! Really helped me understand the Prisma 7 setup.',
  })
  @IsString()
  @MaxLength(1000)
  content!: string;

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Set this OR blogPostId — never both',
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    description: 'Set this OR projectId — never both',
  })
  @IsOptional()
  @IsUUID()
  blogPostId?: string;
}

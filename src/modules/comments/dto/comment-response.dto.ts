import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CommentAuthorDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;
  @ApiProperty({ example: 'Rafee' })
  name!: string;
  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.jpg' })
  avatar?: string;
}

export class CommentResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'Great write-up!' })
  content!: string;

  @ApiProperty({ example: true })
  isApproved!: boolean;

  @ApiProperty({ type: CommentAuthorDto })
  user!: CommentAuthorDto;

  @ApiProperty({ example: '2026-08-26T10:00:00.000Z' })
  createdAt!: Date;
}

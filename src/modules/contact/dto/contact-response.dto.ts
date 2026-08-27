import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'Jane Doe' })
  name!: string;

  @ApiProperty({ example: 'jane@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: '+8801XXXXXXXXX' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Project inquiry' })
  subject?: string;

  @ApiProperty({ example: 'Hi, I would like to discuss a project.' })
  message!: string;

  @ApiProperty({ example: false })
  isRead!: boolean;

  @ApiProperty({ example: '2026-08-26T10:00:00.000Z' })
  createdAt!: Date;
}

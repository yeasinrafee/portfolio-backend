import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'rafee@example.com' })
  email!: string;

  @ApiProperty({ example: 'Yeasin Rafee' })
  name!: string;

  @ApiProperty({ example: 'ADMIN', enum: ['ADMIN', 'USER'] })
  role!: string;

  @ApiProperty({ example: true })
  isActive!: boolean;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Short-lived JWT access token (15 min default)',
  })
  accessToken!: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Long-lived JWT refresh token (7 days default)',
  })
  refreshToken!: string;
}

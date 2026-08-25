/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'rafee@example.com',
    description: 'Valid unique email address of the user',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Password — minimum 8, maximum 64 characters',
    minLength: 8,
    maxLength: 64,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password!: string;

  @ApiProperty({
    example: 'Yeasin Rafee',
    description: 'Full name of the user',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;
}

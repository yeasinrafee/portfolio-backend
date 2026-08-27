import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Jane Doe', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '+8801XXXXXXXXX' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: 'Project inquiry', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  subject?: string;

  @ApiProperty({
    example: 'Hi, I would like to discuss a potential project collaboration.',
  })
  @IsString()
  @MaxLength(2000)
  message!: string;
}

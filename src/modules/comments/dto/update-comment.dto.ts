import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: 'Edited: Great write-up! This helped a lot.' })
  @IsString()
  @MaxLength(1000)
  content!: string;
}

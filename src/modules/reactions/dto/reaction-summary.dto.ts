import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReactionType } from '../../../generated/prisma/enums';

export class ReactionSummaryDto {
  @ApiProperty({ example: 24 })
  likes!: number;

  @ApiProperty({ example: 3 })
  dislikes!: number;

  @ApiPropertyOptional({
    enum: ReactionType,
    example: ReactionType.LIKE,
    description:
      'Current logged-in user’s own reaction, if any (only present when authenticated)',
  })
  myReaction?: ReactionType | null;
}

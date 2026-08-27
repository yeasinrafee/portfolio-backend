/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ReactionQueryDto } from './dto/reaction-query.dto';
import { ReactionSummaryDto } from './dto/reaction-summary.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Reactions')
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Like or dislike a project/blog post (toggle)',
    description:
      'Any authenticated user. Sending the same type again removes the reaction; sending a different type switches it.',
  })
  @ApiOkResponse({ description: 'Reaction created, updated, or removed' })
  @ApiBadRequestResponse({
    description: 'Must provide exactly one of projectId or blogPostId',
  })
  toggle(@CurrentUser() user: { id: string }, @Body() dto: CreateReactionDto) {
    return this.reactionsService.toggle(user.id, dto);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Get like/dislike counts',
    description:
      'Public endpoint. Pass an Authorization header to also get your own reaction status.',
  })
  @ApiOkResponse({ type: ReactionSummaryDto })
  @ApiBadRequestResponse({
    description: 'Must provide exactly one of projectId or blogPostId',
  })
  async getSummary(@Query() query: ReactionQueryDto, @Req() req: any) {
    // if token exist it decode user — guard is not mandatory
    const authHeader = req.headers?.authorization;
    let userId: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded: any = jwt.decode(authHeader.split(' ')[1]);
        userId = decoded?.sub;
      } catch {
        // invalid token will be ignored and treat as public
      }
    }

    return this.reactionsService.getSummary(query, userId);
  }
}

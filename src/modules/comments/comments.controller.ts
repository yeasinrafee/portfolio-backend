import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Role } from '../../generated/prisma/enums';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List comments for a project or blog post',
    description:
      'Public endpoint. Pass exactly one of projectId or blogPostId. Send a valid admin token to see unapproved comments too — otherwise only approved comments are returned.',
  })
  @ApiPaginatedResponse(CommentResponseDto)
  @ApiBadRequestResponse({
    description: 'Must provide exactly one of projectId or blogPostId',
  })
  findAll(
    @Query() query: QueryCommentDto,
    @CurrentUser() user?: { role: Role },
  ) {
    return this.commentsService.findAll(query, user?.role);
  }

  // ২. নতুন অ্যাডমিন এন্ডপয়েন্ট (ড্যাশবোর্ডের জন্য - এটি যোগ করুন)
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard) // এখানে বাধ্যতামূলক JwtAuthGuard ও RolesGuard থাকবে
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List all comments for Admin moderation' })
  findAllForAdmin(@Query() query: QueryCommentDto) {
    return this.commentsService.findAll(query, Role.ADMIN);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Add a comment',
    description:
      'Any authenticated user (ADMIN or USER). Provide exactly one of projectId or blogPostId.',
  })
  @ApiOkResponse({ type: CommentResponseDto })
  @ApiBadRequestResponse({
    description: 'Must provide exactly one of projectId or blogPostId',
  })
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Edit your own comment',
    description: 'Owner or ADMIN only.',
  })
  @ApiOkResponse({ type: CommentResponseDto })
  @ApiForbiddenResponse({ description: 'You can only modify your own comment' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.commentsService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Delete your own comment',
    description: 'Owner or ADMIN only.',
  })
  @ApiOkResponse({ description: 'Comment deleted successfully' })
  @ApiForbiddenResponse({ description: 'You can only modify your own comment' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.commentsService.remove(id, user);
  }

  @Patch(':id/moderate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Approve or hide a comment',
    description: 'Admin only.',
  })
  @ApiOkResponse({ type: CommentResponseDto })
  moderate(@Param('id') id: string, @Body('isApproved') isApproved: boolean) {
    return this.commentsService.moderate(id, isApproved);
  }
}

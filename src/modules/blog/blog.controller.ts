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
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { BlogResponseDto } from './dto/blog-response.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({
    summary: 'List all blog posts',
    description:
      'Public endpoint. Supports pagination, search, filter by status/tag.',
  })
  @ApiPaginatedResponse(BlogResponseDto)
  findAll(@Query() query: QueryBlogDto) {
    return this.blogService.findAll(query);
  }

  @Get(':slug')
  @ApiParam({ name: 'slug', example: 'building-a-fully-dynamic-portfolio' })
  @ApiOperation({
    summary: 'Get a single blog post by slug',
    description:
      'Public endpoint. Includes approved comments and reaction/comment counts. Increments view count.',
  })
  @ApiOkResponse({ description: 'Blog post found' })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a new blog post',
    description: 'Admin only. Content is sanitized server-side.',
  })
  @ApiOkResponse({ type: BlogResponseDto })
  @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  create(@Body() dto: CreateBlogDto) {
    return this.blogService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({ summary: 'Update a blog post', description: 'Admin only.' })
  @ApiOkResponse({ type: BlogResponseDto })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({ summary: 'Delete a blog post', description: 'Admin only.' })
  @ApiOkResponse({ description: 'Blog post deleted successfully' })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}

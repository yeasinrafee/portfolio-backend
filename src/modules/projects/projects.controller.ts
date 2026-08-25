/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ProjectResponseDto } from './dto/project-response.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all projects',
    description:
      'Public endpoint. Supports pagination, search, and filtering by status/category/featured/technology.',
  })
  @ApiPaginatedResponse(ProjectResponseDto)
  findAll(@Query() query: QueryProjectDto) {
    return this.projectsService.findAll(query);
  }

  @Get(':slug')
  @ApiParam({
    name: 'slug',
    example: 'portfolio-dashboard',
    description: 'URL-friendly project slug',
  })
  @ApiOperation({
    summary: 'Get a single project by slug',
    description:
      'Public endpoint. Increments the project view count for analytics.',
  })
  @ApiOkResponse({ description: 'Project found', type: ProjectResponseDto })
  @ApiNotFoundResponse({ description: 'Project not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project', description: 'Admin only.' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Update a project',
    description: 'Admin only. Partial update supported.',
  })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({ summary: 'Delete a project', description: 'Admin only.' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}

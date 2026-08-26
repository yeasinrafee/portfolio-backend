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
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { QueryExperienceDto } from './dto/query-experience.dto';
import { ExperienceResponseDto } from './dto/experience-response.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@ApiTags('Experience')
@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  @ApiOperation({
    summary: 'List all work experience entries',
    description: 'Public endpoint. Sorted by startDate (desc) by default.',
  })
  @ApiPaginatedResponse(ExperienceResponseDto)
  findAll(@Query() query: QueryExperienceDto) {
    return this.experienceService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({ summary: 'Get a single experience entry by ID' })
  @ApiOkResponse({ type: ExperienceResponseDto })
  @ApiNotFoundResponse({ description: 'Experience not found' })
  findOne(@Param('id') id: string) {
    return this.experienceService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a new experience entry',
    description: 'Admin only.',
  })
  @ApiOkResponse({ type: ExperienceResponseDto })
  @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  create(@Body() dto: CreateExperienceDto) {
    return this.experienceService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Update an experience entry',
    description: 'Admin only.',
  })
  @ApiOkResponse({ type: ExperienceResponseDto })
  @ApiNotFoundResponse({ description: 'Experience not found' })
  update(@Param('id') id: string, @Body() dto: UpdateExperienceDto) {
    return this.experienceService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Delete an experience entry',
    description: 'Admin only.',
  })
  @ApiOkResponse({ description: 'Experience deleted successfully' })
  @ApiNotFoundResponse({ description: 'Experience not found' })
  remove(@Param('id') id: string) {
    return this.experienceService.remove(id);
  }
}

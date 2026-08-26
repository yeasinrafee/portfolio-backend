/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
  ApiConflictResponse,
} from '@nestjs/swagger';
import { TechnologiesService } from './technologies.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { QueryTechnologyDto } from './dto/query-technology.dto';
import { TechnologyResponseDto } from './dto/technology-response.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@ApiTags('Technologies')
@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Get()
  @ApiOperation({
    summary: 'List all technologies',
    description:
      'Public endpoint. Supports pagination, search by name, and filter by category.',
  })
  @ApiPaginatedResponse(TechnologyResponseDto)
  findAll(@Query() query: QueryTechnologyDto) {
    return this.technologiesService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({ summary: 'Get a single technology by ID' })
  @ApiOkResponse({
    description: 'Technology found',
    type: TechnologyResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Technology not found' })
  findOne(@Param('id') id: string) {
    return this.technologiesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a new technology',
    description: 'Admin only.',
  })
  @ApiOkResponse({
    description: 'Technology created successfully',
    type: TechnologyResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  @ApiConflictResponse({
    description: 'Technology with this name already exists',
  })
  create(@Body() dto: CreateTechnologyDto) {
    return this.technologiesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({ summary: 'Update a technology', description: 'Admin only.' })
  @ApiOkResponse({
    description: 'Technology updated successfully',
    type: TechnologyResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Technology not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTechnologyDto) {
    return this.technologiesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({ summary: 'Delete a technology', description: 'Admin only.' })
  @ApiOkResponse({ description: 'Technology deleted successfully' })
  @ApiNotFoundResponse({ description: 'Technology not found' })
  remove(@Param('id') id: string) {
    return this.technologiesService.remove(id);
  }
}

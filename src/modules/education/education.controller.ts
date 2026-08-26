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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { QueryEducationDto } from './dto/query-education.dto';
import { EducationResponseDto } from './dto/education-response.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@ApiTags('Education')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  @ApiOperation({
    summary: 'List all education entries',
    description: 'Public endpoint.',
  })
  @ApiPaginatedResponse(EducationResponseDto)
  findAll(@Query() query: QueryEducationDto) {
    return this.educationService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({ summary: 'Get a single education entry by ID' })
  @ApiOkResponse({ type: EducationResponseDto })
  @ApiNotFoundResponse({ description: 'Education not found' })
  findOne(@Param('id') id: string) {
    return this.educationService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a new education entry',
    description: 'Admin only.',
  })
  @ApiOkResponse({ type: EducationResponseDto })
  @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  create(@Body() dto: CreateEducationDto) {
    return this.educationService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Update an education entry',
    description: 'Admin only.',
  })
  @ApiOkResponse({ type: EducationResponseDto })
  @ApiNotFoundResponse({ description: 'Education not found' })
  update(@Param('id') id: string, @Body() dto: UpdateEducationDto) {
    return this.educationService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Delete an education entry',
    description: 'Admin only.',
  })
  @ApiOkResponse({ description: 'Education deleted successfully' })
  @ApiNotFoundResponse({ description: 'Education not found' })
  remove(@Param('id') id: string) {
    return this.educationService.remove(id);
  }
}

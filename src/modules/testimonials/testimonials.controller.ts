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
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { QueryTestimonialDto } from './dto/query-testimonial.dto';
import { TestimonialResponseDto } from './dto/testimonial-response.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@ApiTags('Testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all testimonials',
    description: 'Public endpoint.',
  })
  @ApiPaginatedResponse(TestimonialResponseDto)
  findAll(@Query() query: QueryTestimonialDto) {
    return this.testimonialsService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({ summary: 'Get a single testimonial by ID' })
  @ApiOkResponse({ type: TestimonialResponseDto })
  @ApiNotFoundResponse({ description: 'Testimonial not found' })
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a new testimonial',
    description: 'Admin only.',
  })
  @ApiOkResponse({ type: TestimonialResponseDto })
  @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({ summary: 'Update a testimonial', description: 'Admin only.' })
  @ApiOkResponse({ type: TestimonialResponseDto })
  @ApiNotFoundResponse({ description: 'Testimonial not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({ summary: 'Delete a testimonial', description: 'Admin only.' })
  @ApiOkResponse({ description: 'Testimonial deleted successfully' })
  @ApiNotFoundResponse({ description: 'Testimonial not found' })
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}

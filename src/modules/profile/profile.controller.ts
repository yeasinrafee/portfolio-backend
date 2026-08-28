import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({
    summary: 'Get personal profile info',
    description:
      'Public endpoint. Returns name, bio, contact info, and social links — for the hero section and contact page. Returns an empty structure if not yet set up.',
  })
  @ApiOkResponse({ type: ProfileResponseDto })
  get() {
    return this.profileService.get();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create or update the personal profile',
    description:
      'Admin only. Upsert — creates the profile on first call, updates it afterward. Sending socialLinks replaces the entire list. All fields are optional.',
  })
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  upsert(@Body() dto: UpdateProfileDto) {
    return this.profileService.upsert(dto);
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardOverviewDto } from './dto/dashboard-overview.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('access-token')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get dashboard overview stats',
    description:
      'Admin only. Returns counts across all modules, aggregated view stats, top-performing content, and recent activity — ideal for rendering the admin dashboard home screen in a single call.',
  })
  @ApiOkResponse({ type: DashboardOverviewDto })
  @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  getOverview() {
    return this.dashboardService.getOverview();
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  Req,
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
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { ContactResponseDto } from './dto/contact-response.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({
    summary: 'Submit a contact form message',
    description: 'Public endpoint — no authentication required.',
  })
  @ApiOkResponse({ type: ContactResponseDto })
  create(@Body() dto: CreateContactDto, @Req() req: any) {
    const ipAddress = req.ip ?? req.headers['x-forwarded-for'];
    return this.contactService.create(dto, ipAddress);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List all contact messages',
    description: 'Admin only. Filterable by read/unread status.',
  })
  @ApiPaginatedResponse(ContactResponseDto)
  @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  findAll(@Query() query: QueryContactDto) {
    return this.contactService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Get a single message',
    description: 'Admin only. Automatically marks the message as read.',
  })
  @ApiOkResponse({ type: ContactResponseDto })
  @ApiNotFoundResponse({ description: 'Message not found' })
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/read-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Manually mark message as read/unread',
    description: 'Admin only.',
  })
  @ApiOkResponse({ type: ContactResponseDto })
  markAsRead(@Param('id') id: string, @Body('isRead') isRead: boolean) {
    return this.contactService.markAsRead(id, isRead);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Delete a contact message',
    description: 'Admin only.',
  })
  @ApiOkResponse({ description: 'Message deleted successfully' })
  @ApiNotFoundResponse({ description: 'Message not found' })
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}

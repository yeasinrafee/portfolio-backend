import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateContactDto, ipAddress?: string) {
    return this.prisma.contactMessage.create({ data: { ...dto, ipAddress } });
  }

  async findAll(query: QueryContactDto) {
    const { page = 1, limit = 10, sortBy, sortOrder, isRead } = query;

    const where: Prisma.ContactMessageWhereInput = {
      ...(isRead !== undefined && { isRead }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.contactMessage.findMany({
        where,
        orderBy: { [sortBy ?? 'createdAt']: sortOrder ?? 'desc' },
        skip: query.skip,
        take: limit,
      }),
      this.prisma.contactMessage.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });
    if (!message) throw new NotFoundException('Message not found');

    if (!message.isRead) {
      return this.prisma.contactMessage.update({
        where: { id },
        data: { isRead: true },
      });
    }
    return message;
  }

  async markAsRead(id: string, isRead: boolean) {
    await this.findExistsOrThrow(id);
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });
  }

  async remove(id: string) {
    await this.findExistsOrThrow(id);
    await this.prisma.contactMessage.delete({ where: { id } });
    return { message: 'Message deleted successfully' };
  }

  private async findExistsOrThrow(id: string) {
    const exists = await this.prisma.contactMessage.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Message not found');
  }
}

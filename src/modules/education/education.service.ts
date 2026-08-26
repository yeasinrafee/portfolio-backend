import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { QueryEducationDto } from './dto/query-education.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateEducationDto) {
    return this.prisma.education.create({ data: dto });
  }

  async findAll(query: QueryEducationDto) {
    const { page = 1, limit = 10, sortBy, sortOrder } = query;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.education.findMany({
        orderBy: { [sortBy ?? 'startDate']: sortOrder ?? 'desc' },
        skip: query.skip,
        take: limit,
      }),
      this.prisma.education.count(),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string) {
    const item = await this.prisma.education.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Education not found');
    return item;
  }

  async update(id: string, dto: UpdateEducationDto) {
    await this.findOne(id);
    return this.prisma.education.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.education.delete({ where: { id } });
    return { message: 'Education deleted successfully' };
  }
}

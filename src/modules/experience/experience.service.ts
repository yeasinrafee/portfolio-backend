import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { QueryExperienceDto } from './dto/query-experience.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateExperienceDto) {
    return this.prisma.experience.create({ data: dto });
  }

  async findAll(query: QueryExperienceDto) {
    const { page = 1, limit = 10, sortBy, sortOrder } = query;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.experience.findMany({
        orderBy: { [sortBy ?? 'startDate']: sortOrder ?? 'desc' },
        skip: query.skip,
        take: limit,
      }),
      this.prisma.experience.count(),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string) {
    const item = await this.prisma.experience.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Experience not found');
    return item;
  }

  async update(id: string, dto: UpdateExperienceDto) {
    await this.findOne(id);
    return this.prisma.experience.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.experience.delete({ where: { id } });
    return { message: 'Experience deleted successfully' };
  }
}

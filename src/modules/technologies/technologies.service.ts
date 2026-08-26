/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { QueryTechnologyDto } from './dto/query-technology.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class TechnologiesService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.technology.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  async create(dto: CreateTechnologyDto) {
    const existing = await this.prisma.technology.findUnique({
      where: { name: dto.name },
    });
    if (existing)
      throw new ConflictException('Technology with this name already exists');

    const slug = await this.generateUniqueSlug(dto.name);
    return this.prisma.technology.create({ data: { ...dto, slug } });
  }

  async findAll(query: QueryTechnologyDto) {
    const { page = 1, limit = 10, search, sortBy, sortOrder, category } = query;

    const where: Prisma.TechnologyWhereInput = {
      ...(category && { category }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.technology.findMany({
        where,
        orderBy: { [sortBy ?? 'order']: sortOrder ?? 'asc' },
        skip: query.skip,
        take: limit,
      }),
      this.prisma.technology.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string) {
    const tech = await this.prisma.technology.findUnique({ where: { id } });
    if (!tech) throw new NotFoundException('Technology not found');
    return tech;
  }

  async update(id: string, dto: UpdateTechnologyDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.technology.findUnique({
        where: { name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Technology with this name already exists');
      }
    }

    return this.prisma.technology.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.technology.delete({ where: { id } });
    return { message: 'Technology deleted successfully' };
  }
}

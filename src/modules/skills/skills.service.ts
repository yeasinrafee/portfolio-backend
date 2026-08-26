/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { QuerySkillDto } from './dto/query-skill.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSkillDto) {
    return this.prisma.skill.create({ data: dto });
  }

  async findAll(query: QuerySkillDto) {
    const { page = 1, limit = 10, search, sortBy, sortOrder, category } = query;

    const where: Prisma.SkillWhereInput = {
      ...(category && { category }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.skill.findMany({
        where,
        orderBy: { [sortBy ?? 'order']: sortOrder ?? 'asc' },
        skip: query.skip,
        take: limit,
      }),
      this.prisma.skill.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findGroupedByCategory() {
    const skills = await this.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    const grouped = skills.reduce<Record<string, typeof skills>>(
      (acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
      },
      {},
    );

    return Object.entries(grouped).map(([category, items]) => ({
      category,
      skills: items,
    }));
  }

  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async update(id: string, dto: UpdateSkillDto) {
    await this.findOne(id);
    return this.prisma.skill.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.skill.delete({ where: { id } });
    return { message: 'Skill deleted successfully' };
  }
}

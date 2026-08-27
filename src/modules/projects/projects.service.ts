/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  async create(dto: CreateProjectDto) {
    const { technologyIds, images, ...data } = dto;
    const slug = await this.generateUniqueSlug(dto.title);

    return this.prisma.project.create({
      data: {
        ...data,
        slug,
        technologies: technologyIds
          ? { connect: technologyIds.map((id) => ({ id })) }
          : undefined,
        images: images
          ? {
              create: images.map((img, index) => ({
                ...img,
                order: img.order ?? index,
              })),
            }
          : undefined,
      },
      include: { technologies: true, images: { orderBy: { order: 'asc' } } },
    });
  }

  async findAll(query: QueryProjectDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy,
      sortOrder,
      status,
      featured,
      category,
      technologyId,
    } = query;

    const where: Prisma.ProjectWhereInput = {
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(category && { category }),
      ...(technologyId && { technologies: { some: { id: technologyId } } }),
    };

    // ⬇️ search থাকলে full-text search পথে যাবে, না থাকলে আগের normal filtering
    if (search) {
      return this.searchProjects(search, where, page, limit);
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        include: { technologies: true, images: { orderBy: { order: 'asc' } } },
        orderBy: { [sortBy ?? 'createdAt']: sortOrder ?? 'desc' },
        skip: query.skip,
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  private async searchProjects(
    search: string,
    where: Prisma.ProjectWhereInput,
    page: number,
    limit: number,
  ) {
    const ranked = await this.prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM projects
    WHERE "searchVector" @@ websearch_to_tsquery('english', ${search})
    ORDER BY ts_rank("searchVector", websearch_to_tsquery('english', ${search})) DESC
  `;

    if (ranked.length === 0) {
      return new PaginatedResponseDto([], 0, page, limit);
    }

    const rankedIds = ranked.map((r) => r.id);
    const rankIndex = new Map(rankedIds.map((id, idx) => [id, idx]));

    const [matches, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where: { ...where, id: { in: rankedIds } },
        include: { technologies: true, images: { orderBy: { order: 'asc' } } },
      }),
      this.prisma.project.count({ where: { ...where, id: { in: rankedIds } } }),
    ]);

    const sorted = matches.sort(
      (a, b) => rankIndex.get(a.id)! - rankIndex.get(b.id)!,
    );
    const start = (page - 1) * limit;
    const paginated = sorted.slice(start, start + limit);

    return new PaginatedResponseDto(paginated, total, page, limit);
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        technologies: true,
        images: { orderBy: { order: 'asc' } },
        comments: {
          where: { isApproved: true },
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { reactions: true, comments: true } },
      },
    });

    if (!project) throw new NotFoundException('Project not found');

    await this.prisma.project.update({
      where: { id: project.id },
      data: { viewCount: { increment: 1 } },
    });

    return project;
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { technologies: true, images: { orderBy: { order: 'asc' } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    const { technologyIds, images, ...data } = dto;

    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        technologies: technologyIds
          ? { set: technologyIds.map((tid) => ({ id: tid })) }
          : undefined,
        images: images
          ? {
              deleteMany: {},
              create: images.map((img, index) => ({
                ...img,
                order: img.order ?? index,
              })),
            }
          : undefined,
      },
      include: { technologies: true, images: { orderBy: { order: 'asc' } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });
    return { message: 'Project deleted successfully' };
  }
}

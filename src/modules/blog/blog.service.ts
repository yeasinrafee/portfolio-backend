/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import sanitizeHtml from 'sanitize-html';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogSortOption, QueryBlogDto } from './dto/query-blog.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Prisma, Status } from '../../generated/prisma/client';

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    's',
    'h1',
    'h2',
    'h3',
    'h4',
    'ul',
    'ol',
    'li',
    'a',
    'blockquote',
    'code',
    'pre',
    'img',
    'span',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    span: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  private calculateReadingTime(html: string): number {
    const text = html.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  async create(dto: CreateBlogDto) {
    const slug = await this.generateUniqueSlug(dto.title);
    const sanitizedContent = sanitizeHtml(dto.content, SANITIZE_OPTIONS);
    const readingTimeMins = this.calculateReadingTime(sanitizedContent);

    return this.prisma.blogPost.create({
      data: { ...dto, slug, content: sanitizedContent, readingTimeMins },
    });
  }

  async findAll(query: QueryBlogDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      tag,
      sort,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.BlogPostWhereInput = {
      ...(status && { status }),
      ...(tag && { tags: { has: tag } }),
    };

    if (search) {
      return this.searchBlogPosts(search, where, page, limit);
    }

    const orderBy = this.resolveSortOrder(sort, sortBy, sortOrder);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.blogPost.findMany({
        where,
        orderBy,
        skip: query.skip,
        take: limit,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  /** Homepage/sidebar widget-এর জন্য — pagination wrapper ছাড়া সরাসরি array */
  async findPopular(limit = 5) {
    return this.prisma.blogPost.findMany({
      where: { status: Status.PUBLISHED },
      orderBy: { viewCount: 'desc' },
      take: limit,
    });
  }

  private resolveSortOrder(
    sort?: BlogSortOption,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
  ): Prisma.BlogPostOrderByWithRelationInput {
    switch (sort) {
      case BlogSortOption.POPULAR:
        return { viewCount: 'desc' };
      case BlogSortOption.OLDEST:
        return { createdAt: 'asc' };
      case BlogSortOption.LATEST:
        return { createdAt: 'desc' };
      default:
        return { [sortBy ?? 'createdAt']: sortOrder ?? 'desc' };
    }
  }

  private async searchBlogPosts(
    search: string,
    where: Prisma.BlogPostWhereInput,
    page: number,
    limit: number,
  ) {
    const ranked = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM blog_posts
      WHERE "searchVector" @@ websearch_to_tsquery('english', ${search})
      ORDER BY ts_rank("searchVector", websearch_to_tsquery('english', ${search})) DESC
    `;

    if (ranked.length === 0) {
      return new PaginatedResponseDto([], 0, page, limit);
    }

    const rankedIds = ranked.map((r) => r.id);
    const rankIndex = new Map(rankedIds.map((id, idx) => [id, idx]));

    const [matches, total] = await this.prisma.$transaction([
      this.prisma.blogPost.findMany({
        where: { ...where, id: { in: rankedIds } },
      }),
      this.prisma.blogPost.count({
        where: { ...where, id: { in: rankedIds } },
      }),
    ]);

    const sorted = matches.sort(
      (a, b) => rankIndex.get(a.id)! - rankIndex.get(b.id)!,
    );
    const start = (page - 1) * limit;
    const paginated = sorted.slice(start, start + limit);

    return new PaginatedResponseDto(paginated, total, page, limit);
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        comments: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { reactions: true, comments: true } },
      },
    });

    if (!post) throw new NotFoundException('Blog post not found');

    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async update(id: string, dto: UpdateBlogDto) {
    await this.findOne(id);

    const data: Prisma.BlogPostUpdateInput = { ...dto };
    if (dto.content) {
      data.content = sanitizeHtml(dto.content, SANITIZE_OPTIONS);
      data.readingTimeMins = this.calculateReadingTime(data.content as string);
    }

    return this.prisma.blogPost.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.blogPost.delete({ where: { id } });
    return { message: 'Blog post deleted successfully' };
  }
}

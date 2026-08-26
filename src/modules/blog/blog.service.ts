/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import sanitizeHtml from 'sanitize-html';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Prisma } from '../../generated/prisma/client';

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
      sortBy,
      sortOrder,
      status,
      tag,
    } = query;

    const where: Prisma.BlogPostWhereInput = {
      ...(status && { status }),
      ...(tag && { tags: { has: tag } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.blogPost.findMany({
        where,
        orderBy: { [sortBy ?? 'createdAt']: sortOrder ?? 'desc' },
        skip: query.skip,
        take: limit,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
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

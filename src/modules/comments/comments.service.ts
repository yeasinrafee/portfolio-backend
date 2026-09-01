/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Role } from '../../generated/prisma/enums';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  private validateExactlyOneTarget(projectId?: string, blogPostId?: string) {
    if ((!projectId && !blogPostId) || (projectId && blogPostId)) {
      throw new BadRequestException(
        'Provide exactly one of projectId or blogPostId',
      );
    }
  }

  async create(userId: string, dto: CreateCommentDto) {
    this.validateExactlyOneTarget(dto.projectId, dto.blogPostId);

    if (dto.projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: dto.projectId },
      });
      if (!project) throw new NotFoundException('Project not found');
    }
    if (dto.blogPostId) {
      const post = await this.prisma.blogPost.findUnique({
        where: { id: dto.blogPostId },
      });
      if (!post) throw new NotFoundException('Blog post not found');
    }

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        userId,
        projectId: dto.projectId,
        blogPostId: dto.blogPostId,
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  }

  // async findAll(query: QueryCommentDto, requesterRole?: Role) {
  //   const {
  //     page = 1,
  //     limit = 10,
  //     sortBy,
  //     sortOrder,
  //     projectId,
  //     blogPostId,
  //   } = query;
  //   this.validateExactlyOneTarget(projectId, blogPostId);

  //   // Admin can get all the comments (for moderation); normal visitor approved comment will be shown
  //   const where = {
  //     ...(projectId && { projectId }),
  //     ...(blogPostId && { blogPostId }),
  //     ...(requesterRole !== Role.ADMIN && { isApproved: true }),
  //   };

  //   const [data, total] = await this.prisma.$transaction([
  //     this.prisma.comment.findMany({
  //       where,
  //       include: { user: { select: { id: true, name: true, avatar: true } } },
  //       orderBy: { [sortBy ?? 'createdAt']: sortOrder ?? 'desc' },
  //       skip: query.skip,
  //       take: limit,
  //     }),
  //     this.prisma.comment.count({ where }),
  //   ]);

  //   return new PaginatedResponseDto(data, total, page, limit);
  // }

  async findAll(query: QueryCommentDto, requesterRole?: Role) {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      projectId,
      blogPostId,
    } = query;

    const isAdmin = requesterRole === Role.ADMIN;

    // ইউজার যদি ADMIN না হয়, তবেই কেবল প্রজেক্ট বা ব্লগ আইডি থাকা বাধ্যতামূলক
    if (requesterRole !== Role.ADMIN) {
      this.validateExactlyOneTarget(projectId, blogPostId);
    }

    const where: any = {};

    if (projectId) where.projectId = projectId;
    if (blogPostId) where.blogPostId = blogPostId;

    // ADMIN না হলে শুধুমাত্র Approved কমেন্ট ফিল্টার হবে
    if (requesterRole !== Role.ADMIN) {
      where.isApproved = true;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where,
        include: {
          user: {
            select: isAdmin
              ? { id: true, name: true, avatar: true, email: true } // admin-only view এ email
              : { id: true, name: true, avatar: true }, // public/user view এ email নেই
          },
          project: { select: { id: true, title: true, slug: true } },
          blogPost: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { [sortBy ?? 'createdAt']: sortOrder ?? 'desc' },
        skip: query.skip ?? (page - 1) * limit,
        take: limit,
      }),
      this.prisma.comment.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  private assertOwnerOrAdmin(
    comment: { userId: string },
    currentUser: { id: string; role: Role },
  ) {
    if (comment.userId !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('You can only modify your own comment');
    }
  }

  async update(
    id: string,
    dto: UpdateCommentDto,
    currentUser: { id: string; role: Role },
  ) {
    const comment = await this.findOne(id);
    this.assertOwnerOrAdmin(comment, currentUser);

    return this.prisma.comment.update({
      where: { id },
      data: { content: dto.content },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async remove(id: string, currentUser: { id: string; role: Role }) {
    const comment = await this.findOne(id);
    this.assertOwnerOrAdmin(comment, currentUser);

    await this.prisma.comment.delete({ where: { id } });
    return { message: 'Comment deleted successfully' };
  }

  /** Admin moderation — inappropriate comments hide/unhide */
  async moderate(id: string, isApproved: boolean) {
    await this.findOne(id);
    return this.prisma.comment.update({ where: { id }, data: { isApproved } });
  }
}

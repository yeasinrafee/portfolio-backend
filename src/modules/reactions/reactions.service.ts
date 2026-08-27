import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ReactionQueryDto } from './dto/reaction-query.dto';
import { ReactionType } from '../../generated/prisma/enums';

@Injectable()
export class ReactionsService {
  constructor(private readonly prisma: PrismaService) {}

  private validateExactlyOneTarget(projectId?: string, blogPostId?: string) {
    if ((!projectId && !blogPostId) || (projectId && blogPostId)) {
      throw new BadRequestException(
        'Provide exactly one of projectId or blogPostId',
      );
    }
  }

  /**
   * Toggle behavior:
   * - If there is no reaction → create new
   * - same type reaction → reaction will be removed (unlike/un-dislike)
   * - different type reaction → existed reaction will be updated (like → dislike)
   */
  async toggle(userId: string, dto: CreateReactionDto) {
    this.validateExactlyOneTarget(dto.projectId, dto.blogPostId);

    if (dto.projectId) {
      const exists = await this.prisma.project.findUnique({
        where: { id: dto.projectId },
      });
      if (!exists) throw new NotFoundException('Project not found');
    }
    if (dto.blogPostId) {
      const exists = await this.prisma.blogPost.findUnique({
        where: { id: dto.blogPostId },
      });
      if (!exists) throw new NotFoundException('Blog post not found');
    }

    const existing = await this.prisma.reaction.findFirst({
      where: {
        userId,
        projectId: dto.projectId ?? null,
        blogPostId: dto.blogPostId ?? null,
      },
    });

    if (!existing) {
      await this.prisma.reaction.create({
        data: {
          type: dto.type,
          userId,
          projectId: dto.projectId,
          blogPostId: dto.blogPostId,
        },
      });
      return { action: 'created', type: dto.type };
    }

    if (existing.type === dto.type) {
      await this.prisma.reaction.delete({ where: { id: existing.id } });
      return { action: 'removed', type: dto.type };
    }

    await this.prisma.reaction.update({
      where: { id: existing.id },
      data: { type: dto.type },
    });
    return { action: 'updated', type: dto.type };
  }

  async getSummary(query: ReactionQueryDto, userId?: string) {
    this.validateExactlyOneTarget(query.projectId, query.blogPostId);

    const where = {
      projectId: query.projectId ?? null,
      blogPostId: query.blogPostId ?? null,
    };

    const [likes, dislikes, myReaction] = await Promise.all([
      this.prisma.reaction.count({
        where: { ...where, type: ReactionType.LIKE },
      }),
      this.prisma.reaction.count({
        where: { ...where, type: ReactionType.DISLIKE },
      }),
      userId
        ? this.prisma.reaction.findFirst({
            where: { ...where, userId },
            select: { type: true },
          })
        : null,
    ]);

    return { likes, dislikes, myReaction: myReaction?.type ?? null };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '../../generated/prisma/enums';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [
      totalProjects,
      publishedProjects,
      totalBlogPosts,
      publishedBlogPosts,
      totalSkills,
      totalTechnologies,
      totalTestimonials,
      totalUsers,
      totalComments,
      totalReactions,
      totalMessages,
      unreadMessages,
      projectViewsAgg,
      blogViewsAgg,
      topProjects,
      topBlogPosts,
      recentCommentsRaw,
      recentMessages,
    ] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.count({ where: { status: Status.PUBLISHED } }),
      this.prisma.blogPost.count(),
      this.prisma.blogPost.count({ where: { status: Status.PUBLISHED } }),
      this.prisma.skill.count(),
      this.prisma.technology.count(),
      this.prisma.testimonial.count(),
      this.prisma.user.count(),
      this.prisma.comment.count(),
      this.prisma.reaction.count(),
      this.prisma.contactMessage.count(),
      this.prisma.contactMessage.count({ where: { isRead: false } }),
      this.prisma.project.aggregate({ _sum: { viewCount: true } }),
      this.prisma.blogPost.aggregate({ _sum: { viewCount: true } }),
      this.prisma.project.findMany({
        orderBy: { viewCount: 'desc' },
        take: 5,
        select: { id: true, title: true, slug: true, viewCount: true },
      }),
      this.prisma.blogPost.findMany({
        orderBy: { viewCount: 'desc' },
        take: 5,
        select: { id: true, title: true, slug: true, viewCount: true },
      }),
      this.prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { name: true } } },
      }),
      this.prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      counts: {
        totalProjects,
        publishedProjects,
        totalBlogPosts,
        publishedBlogPosts,
        totalSkills,
        totalTechnologies,
        totalTestimonials,
        totalUsers,
        totalComments,
        totalReactions,
        totalMessages,
        unreadMessages,
      },
      viewStats: {
        totalProjectViews: projectViewsAgg._sum.viewCount ?? 0,
        totalBlogViews: blogViewsAgg._sum.viewCount ?? 0,
      },
      topProjects,
      topBlogPosts,
      recentComments: recentCommentsRaw.map((c) => ({
        id: c.id,
        content: c.content,
        userName: c.user.name,
        createdAt: c.createdAt,
      })),
      recentMessages,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '../../generated/prisma/enums';
import RSS from 'rss';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  async getSitemapData() {
    const [projects, blogPosts] = await Promise.all([
      this.prisma.project.findMany({
        where: { status: Status.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
      this.prisma.blogPost.findMany({
        where: { status: Status.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return {
      projects: projects.map((p) => ({
        path: `/projects/${p.slug}`,
        lastModified: p.updatedAt,
      })),
      blogPosts: blogPosts.map((b) => ({
        path: `/blog/${b.slug}`,
        lastModified: b.updatedAt,
      })),
    };
  }

  async generateRssFeed(): Promise<string> {
    const posts = await this.prisma.blogPost.findMany({
      where: { status: Status.PUBLISHED },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const feed = new RSS({
      title: 'Rafee — Blog',
      description: 'Articles on full-stack development, DevOps, and AI/ML',
      feed_url: 'https://myportfolio.com/rss.xml',
      site_url: 'https://myportfolio.com',
      language: 'en',
    });

    posts.forEach((post) => {
      feed.item({
        title: post.title,
        description: post.excerpt ?? '',
        url: `https://myportfolio.com/blog/${post.slug}`,
        date: post.createdAt,
      });
    });

    return feed.xml({ indent: true });
  }
}

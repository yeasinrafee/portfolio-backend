import { ApiProperty } from '@nestjs/swagger';

class CountsDto {
  @ApiProperty({ example: 12 }) totalProjects!: number;
  @ApiProperty({ example: 9 }) publishedProjects!: number;
  @ApiProperty({ example: 8 }) totalBlogPosts!: number;
  @ApiProperty({ example: 6 }) publishedBlogPosts!: number;
  @ApiProperty({ example: 24 }) totalSkills!: number;
  @ApiProperty({ example: 15 }) totalTechnologies!: number;
  @ApiProperty({ example: 5 }) totalTestimonials!: number;
  @ApiProperty({ example: 132 }) totalUsers!: number;
  @ApiProperty({ example: 87 }) totalComments!: number;
  @ApiProperty({ example: 340 }) totalReactions!: number;
  @ApiProperty({ example: 42 }) totalMessages!: number;
  @ApiProperty({ example: 7 }) unreadMessages!: number;
}

class ViewStatsDto {
  @ApiProperty({ example: 15234 }) totalProjectViews!: number;
  @ApiProperty({ example: 9876 }) totalBlogViews!: number;
}

class TopContentItemDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }) id!: string;
  @ApiProperty({ example: 'Portfolio Dashboard' }) title!: string;
  @ApiProperty({ example: 'portfolio-dashboard' }) slug!: string;
  @ApiProperty({ example: 892 }) viewCount!: number;
}

class RecentCommentDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }) id!: string;
  @ApiProperty({ example: 'Great project!' }) content!: string;
  @ApiProperty({ example: 'Jane Doe' }) userName!: string;
  @ApiProperty({ example: '2026-08-26T10:00:00.000Z' }) createdAt!: Date;
}

class RecentMessageDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }) id!: string;
  @ApiProperty({ example: 'Jane Doe' }) name!: string;
  @ApiProperty({ example: 'jane@example.com' }) email!: string;
  @ApiProperty({ example: 'Project inquiry' }) subject?: string;
  @ApiProperty({ example: false }) isRead!: boolean;
  @ApiProperty({ example: '2026-08-26T10:00:00.000Z' }) createdAt!: Date;
}

export class DashboardOverviewDto {
  @ApiProperty({ type: CountsDto }) counts!: CountsDto;
  @ApiProperty({ type: ViewStatsDto }) viewStats!: ViewStatsDto;
  @ApiProperty({ type: [TopContentItemDto] }) topProjects!: TopContentItemDto[];
  @ApiProperty({ type: [TopContentItemDto] })
  topBlogPosts!: TopContentItemDto[];
  @ApiProperty({ type: [RecentCommentDto] })
  recentComments!: RecentCommentDto[];
  @ApiProperty({ type: [RecentMessageDto] })
  recentMessages!: RecentMessageDto[];
}

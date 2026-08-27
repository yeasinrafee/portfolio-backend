/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { SeoService } from './seo.service';
import { Res } from '@nestjs/common';
import type { Response } from 'express';

@ApiTags('SEO')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('sitemap-data')
  @ApiOperation({
    summary: 'Get all public URLs for sitemap generation',
    description:
      'Public endpoint. Returns published project/blog slugs with last-updated timestamps — meant to be consumed by the frontend to generate sitemap.xml (e.g. Next.js app/sitemap.ts).',
  })
  @ApiOkResponse({ description: 'List of sitemap-ready URLs' })
  getSitemapData() {
    return this.seoService.getSitemapData();
  }

  @Get('rss.xml')
  @ApiOperation({
    summary: 'Get blog RSS feed',
    description: 'Public endpoint. Returns XML.',
  })
  async getRssFeed(@Res() res: Response) {
    const xml = await this.seoService.generateRssFeed();
    res.set('Content-Type', 'application/rss+xml');
    res.send(xml);
  }
}

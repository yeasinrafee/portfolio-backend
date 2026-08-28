/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    const profile = await this.prisma.profile.findFirst({
      include: { socialLinks: { orderBy: { order: 'asc' } } },
    });
    return profile ?? { socialLinks: [] };
  }

  async upsert(dto: UpdateProfileDto) {
    const { socialLinks, ...data } = dto;
    const existing = await this.prisma.profile.findFirst();

    if (!existing) {
      return this.prisma.profile.create({
        data: {
          ...data,
          socialLinks: socialLinks
            ? {
                create: socialLinks.map((link, index) => ({
                  ...link,
                  order: link.order ?? index,
                })),
              }
            : undefined,
        },
        include: { socialLinks: { orderBy: { order: 'asc' } } },
      });
    }

    return this.prisma.profile.update({
      where: { id: existing.id },
      data: {
        ...data,
        socialLinks: socialLinks
          ? {
              deleteMany: {},
              create: socialLinks.map((link, index) => ({
                ...link,
                order: link.order ?? index,
              })),
            }
          : undefined,
      },
      include: { socialLinks: { orderBy: { order: 'asc' } } },
    });
  }
}

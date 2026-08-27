import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TechnologiesModule } from './modules/technologies/technologies.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { EducationModule } from './modules/education/education.module';
import { BlogModule } from './modules/blog/blog.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ReactionsModule } from './modules/reactions/reactions.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { ContactModule } from './modules/contact/contact.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SeoModule } from './modules/seo/seo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 min window
        limit: 100, // One IP per min, max 100 request
      },
    ]),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    TechnologiesModule,
    SkillsModule,
    ExperienceModule,
    EducationModule,
    BlogModule,
    CommentsModule,
    ReactionsModule,
    TestimonialsModule,
    ContactModule,
    DashboardModule,
    CloudinaryModule,
    UploadsModule,
    SeoModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

/*
  Warnings:

  - You are about to drop the column `images` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "coverImageAlt" TEXT,
ADD COLUMN     "metaKeywords" TEXT[],
ADD COLUMN     "ogImage" TEXT;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "images",
ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaKeywords" TEXT[],
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "ogImage" TEXT;

-- CreateTable
CREATE TABLE "project_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_images_projectId_idx" ON "project_images"("projectId");

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

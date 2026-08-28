-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "shortDescription" TEXT,
    "description" TEXT,
    "avatar" TEXT,
    "currentStatus" TEXT,
    "email" TEXT,
    "primaryPhone" TEXT,
    "secondaryPhone" TEXT,
    "presentAddress" TEXT,
    "permanentAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "social_links_profileId_idx" ON "social_links"("profileId");

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

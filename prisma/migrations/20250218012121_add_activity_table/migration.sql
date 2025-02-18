/*
  Warnings:

  - Added the required column `activityId` to the `business_activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business_activities" ADD COLUMN     "activityId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "activity_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "impactScale" SMALLINT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activity_categories_name_key" ON "activity_categories"("name");

-- CreateIndex
CREATE INDEX "activities_categoryId_idx" ON "activities"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "activities_name_categoryId_key" ON "activities"("name", "categoryId");

-- CreateIndex
CREATE INDEX "business_activities_activityId_idx" ON "business_activities"("activityId");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "activity_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_activities" ADD CONSTRAINT "business_activities_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

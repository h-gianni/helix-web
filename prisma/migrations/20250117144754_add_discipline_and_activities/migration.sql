/*
  Warnings:

  - You are about to drop the `Goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Initiative` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Score` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamInitiative` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,ownerId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `disciplineId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ONLEAVE');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ACKNOWLEDGED');

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Initiative" DROP CONSTRAINT "Initiative_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_initiativeId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_memberId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInitiative" DROP CONSTRAINT "TeamInitiative_initiativeId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInitiative" DROP CONSTRAINT "TeamInitiative_teamId_fkey";

-- AlterTable
ALTER TABLE "JobGrade" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "joinedDate" TIMESTAMP(3),
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "disciplineId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Goal";

-- DropTable
DROP TABLE "Initiative";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "Score";

-- DropTable
DROP TABLE "TeamInitiative";

-- CreateTable
CREATE TABLE "Discipline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Discipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobTitle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "JobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "value" SMALLINT NOT NULL,
    "memberId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StructuredFeedback" (
    "id" TEXT NOT NULL,
    "strengths" TEXT[],
    "improvements" TEXT[],
    "goals" TEXT[],
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StructuredFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceReview" (
    "id" TEXT NOT NULL,
    "quarter" SMALLINT NOT NULL,
    "year" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerformanceReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "performedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Discipline_name_key" ON "Discipline"("name");

-- CreateIndex
CREATE INDEX "JobTitle_disciplineId_idx" ON "JobTitle"("disciplineId");

-- CreateIndex
CREATE UNIQUE INDEX "JobTitle_name_disciplineId_key" ON "JobTitle"("name", "disciplineId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_name_key" ON "Activity"("name");

-- CreateIndex
CREATE INDEX "Rating_memberId_idx" ON "Rating"("memberId");

-- CreateIndex
CREATE INDEX "Rating_activityId_idx" ON "Rating"("activityId");

-- CreateIndex
CREATE INDEX "StructuredFeedback_memberId_idx" ON "StructuredFeedback"("memberId");

-- CreateIndex
CREATE INDEX "Comment_memberId_idx" ON "Comment"("memberId");

-- CreateIndex
CREATE INDEX "PerformanceReview_memberId_idx" ON "PerformanceReview"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceReview_memberId_quarter_year_key" ON "PerformanceReview"("memberId", "quarter", "year");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_performedBy_idx" ON "AuditLog"("performedBy");

-- CreateIndex
CREATE INDEX "Member_teamId_idx" ON "Member"("teamId");

-- CreateIndex
CREATE INDEX "Member_jobGradeId_idx" ON "Member"("jobGradeId");

-- CreateIndex
CREATE INDEX "Team_disciplineId_idx" ON "Team"("disciplineId");

-- CreateIndex
CREATE INDEX "Team_ownerId_idx" ON "Team"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_ownerId_key" ON "Team"("name", "ownerId");

-- AddForeignKey
ALTER TABLE "JobTitle" ADD CONSTRAINT "JobTitle_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructuredFeedback" ADD CONSTRAINT "StructuredFeedback_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReview" ADD CONSTRAINT "PerformanceReview_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

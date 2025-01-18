/*
  Warnings:

  - You are about to drop the column `disciplineId` on the `JobTitle` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `JobTitle` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `content` on the `PerformanceReview` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `PerformanceReview` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PerformanceReview` table. All the data in the column will be lost.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Discipline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Initiative` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobGrade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StructuredFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,teamFunctionId]` on the table `JobTitle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamMemberId,quarter,year]` on the table `PerformanceReview` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamFunctionId` to the `JobTitle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamMemberId` to the `PerformanceReview` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TeamMemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ONLEAVE');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Initiative" DROP CONSTRAINT "Initiative_teamId_fkey";

-- DropForeignKey
ALTER TABLE "JobTitle" DROP CONSTRAINT "JobTitle_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_jobGradeId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_userId_fkey";

-- DropForeignKey
ALTER TABLE "PerformanceReview" DROP CONSTRAINT "PerformanceReview_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_activityId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_memberId_fkey";

-- DropForeignKey
ALTER TABLE "StructuredFeedback" DROP CONSTRAINT "StructuredFeedback_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_ownerId_fkey";

-- DropIndex
DROP INDEX "JobTitle_disciplineId_idx";

-- DropIndex
DROP INDEX "JobTitle_name_disciplineId_key";

-- DropIndex
DROP INDEX "PerformanceReview_memberId_idx";

-- DropIndex
DROP INDEX "PerformanceReview_memberId_quarter_year_key";

-- AlterTable
ALTER TABLE "JobTitle" DROP COLUMN "disciplineId",
ADD COLUMN     "customFields" JSONB,
ADD COLUMN     "teamFunctionId" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "PerformanceReview" DROP COLUMN "content",
DROP COLUMN "memberId",
DROP COLUMN "status",
ADD COLUMN     "customFields" JSONB,
ADD COLUMN     "teamMemberId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Discipline";

-- DropTable
DROP TABLE "Initiative";

-- DropTable
DROP TABLE "JobGrade";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "Rating";

-- DropTable
DROP TABLE "StructuredFeedback";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "MemberStatus";

-- DropEnum
DROP TYPE "ReviewStatus";

-- CreateTable
CREATE TABLE "app_users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100),
    "clerkId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "app_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_functions" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "team_functions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_grades" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "grade" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "job_grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessActivity" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "teamId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "BusinessActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GTeam" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "teamFunctionId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "GTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "title" VARCHAR(100),
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "status" "TeamMemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedDate" TIMESTAMP(3),
    "jobGradeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_users_email_key" ON "app_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "app_users_clerkId_key" ON "app_users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "team_functions_name_key" ON "team_functions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "job_grades_level_key" ON "job_grades"("level");

-- CreateIndex
CREATE UNIQUE INDEX "job_grades_grade_key" ON "job_grades"("grade");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessActivity_name_key" ON "BusinessActivity"("name");

-- CreateIndex
CREATE INDEX "BusinessActivity_teamId_createdAt_idx" ON "BusinessActivity"("teamId", "createdAt");

-- CreateIndex
CREATE INDEX "GTeam_teamFunctionId_idx" ON "GTeam"("teamFunctionId");

-- CreateIndex
CREATE INDEX "GTeam_ownerId_idx" ON "GTeam"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "GTeam_name_ownerId_key" ON "GTeam"("name", "ownerId");

-- CreateIndex
CREATE INDEX "TeamMember_teamId_idx" ON "TeamMember"("teamId");

-- CreateIndex
CREATE INDEX "TeamMember_jobGradeId_idx" ON "TeamMember"("jobGradeId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_userId_teamId_key" ON "TeamMember"("userId", "teamId");

-- CreateIndex
CREATE INDEX "JobTitle_teamFunctionId_idx" ON "JobTitle"("teamFunctionId");

-- CreateIndex
CREATE UNIQUE INDEX "JobTitle_name_teamFunctionId_key" ON "JobTitle"("name", "teamFunctionId");

-- CreateIndex
CREATE INDEX "PerformanceReview_teamMemberId_idx" ON "PerformanceReview"("teamMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceReview_teamMemberId_quarter_year_key" ON "PerformanceReview"("teamMemberId", "quarter", "year");

-- AddForeignKey
ALTER TABLE "JobTitle" ADD CONSTRAINT "JobTitle_teamFunctionId_fkey" FOREIGN KEY ("teamFunctionId") REFERENCES "team_functions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessActivity" ADD CONSTRAINT "BusinessActivity_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "GTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessActivity" ADD CONSTRAINT "BusinessActivity_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "app_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GTeam" ADD CONSTRAINT "GTeam_teamFunctionId_fkey" FOREIGN KEY ("teamFunctionId") REFERENCES "team_functions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GTeam" ADD CONSTRAINT "GTeam_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "GTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_jobGradeId_fkey" FOREIGN KEY ("jobGradeId") REFERENCES "job_grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReview" ADD CONSTRAINT "PerformanceReview_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

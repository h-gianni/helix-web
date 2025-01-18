/*
  Warnings:

  - You are about to drop the `BusinessActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobTitle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PerformanceReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ACKNOWLEDGED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "BusinessActivityStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('APP_USER', 'TEAM_FUNCTION', 'JOB_TITLE', 'JOB_GRADE', 'BUSINESS_ACTIVITY', 'G_TEAM', 'TEAM_MEMBER', 'MEMBER_RATING', 'STRUCTURED_FEEDBACK', 'MEMBER_COMMENT', 'PERFORMANCE_REVIEW');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'STATUS_CHANGE');

-- DropForeignKey
ALTER TABLE "BusinessActivity" DROP CONSTRAINT "BusinessActivity_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "BusinessActivity" DROP CONSTRAINT "BusinessActivity_teamId_fkey";

-- DropForeignKey
ALTER TABLE "GTeam" DROP CONSTRAINT "GTeam_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "GTeam" DROP CONSTRAINT "GTeam_teamFunctionId_fkey";

-- DropForeignKey
ALTER TABLE "JobTitle" DROP CONSTRAINT "JobTitle_teamFunctionId_fkey";

-- DropForeignKey
ALTER TABLE "PerformanceReview" DROP CONSTRAINT "PerformanceReview_teamMemberId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_jobGradeId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- AlterTable
ALTER TABLE "job_grades" ADD COLUMN     "typicalResponsibilities" TEXT;

-- DropTable
DROP TABLE "BusinessActivity";

-- DropTable
DROP TABLE "GTeam";

-- DropTable
DROP TABLE "JobTitle";

-- DropTable
DROP TABLE "PerformanceReview";

-- DropTable
DROP TABLE "TeamMember";

-- CreateTable
CREATE TABLE "job_titles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "teamFunctionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "job_titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_activities" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100),
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "BusinessActivityStatus" NOT NULL DEFAULT 'ACTIVE',
    "dueDate" TIMESTAMP(3),
    "teamId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "business_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "g_teams" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "teamFunctionId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "g_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "title" VARCHAR(100),
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "status" "TeamMemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "firstName" VARCHAR(50),
    "lastName" VARCHAR(50),
    "photoUrl" TEXT,
    "joinedDate" TIMESTAMP(3),
    "jobGradeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_ratings" (
    "id" TEXT NOT NULL,
    "value" SMALLINT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "structured_feedback" (
    "id" TEXT NOT NULL,
    "strengths" TEXT[],
    "improvements" TEXT[],
    "goals" TEXT[],
    "teamMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customFields" JSONB,

    CONSTRAINT "structured_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_comments" (
    "id" TEXT NOT NULL,
    "content" VARCHAR(2000) NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_reviews" (
    "id" TEXT NOT NULL,
    "quarter" SMALLINT NOT NULL,
    "year" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "teamMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customFields" JSONB,

    CONSTRAINT "performance_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "performedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_titles_teamFunctionId_idx" ON "job_titles"("teamFunctionId");

-- CreateIndex
CREATE INDEX "job_titles_deletedAt_idx" ON "job_titles"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "job_titles_name_teamFunctionId_key" ON "job_titles"("name", "teamFunctionId");

-- CreateIndex
CREATE UNIQUE INDEX "business_activities_name_key" ON "business_activities"("name");

-- CreateIndex
CREATE INDEX "business_activities_teamId_createdAt_idx" ON "business_activities"("teamId", "createdAt");

-- CreateIndex
CREATE INDEX "business_activities_status_idx" ON "business_activities"("status");

-- CreateIndex
CREATE INDEX "business_activities_createdBy_idx" ON "business_activities"("createdBy");

-- CreateIndex
CREATE INDEX "business_activities_deletedAt_idx" ON "business_activities"("deletedAt");

-- CreateIndex
CREATE INDEX "g_teams_teamFunctionId_idx" ON "g_teams"("teamFunctionId");

-- CreateIndex
CREATE INDEX "g_teams_ownerId_idx" ON "g_teams"("ownerId");

-- CreateIndex
CREATE INDEX "g_teams_deletedAt_idx" ON "g_teams"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "g_teams_name_ownerId_key" ON "g_teams"("name", "ownerId");

-- CreateIndex
CREATE INDEX "team_members_teamId_idx" ON "team_members"("teamId");

-- CreateIndex
CREATE INDEX "team_members_jobGradeId_idx" ON "team_members"("jobGradeId");

-- CreateIndex
CREATE INDEX "team_members_status_idx" ON "team_members"("status");

-- CreateIndex
CREATE INDEX "team_members_deletedAt_idx" ON "team_members"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_userId_teamId_key" ON "team_members"("userId", "teamId");

-- CreateIndex
CREATE INDEX "member_ratings_teamMemberId_idx" ON "member_ratings"("teamMemberId");

-- CreateIndex
CREATE INDEX "member_ratings_activityId_idx" ON "member_ratings"("activityId");

-- CreateIndex
CREATE INDEX "member_ratings_createdAt_idx" ON "member_ratings"("createdAt");

-- CreateIndex
CREATE INDEX "structured_feedback_teamMemberId_idx" ON "structured_feedback"("teamMemberId");

-- CreateIndex
CREATE INDEX "structured_feedback_createdAt_idx" ON "structured_feedback"("createdAt");

-- CreateIndex
CREATE INDEX "member_comments_teamMemberId_idx" ON "member_comments"("teamMemberId");

-- CreateIndex
CREATE INDEX "member_comments_createdAt_idx" ON "member_comments"("createdAt");

-- CreateIndex
CREATE INDEX "performance_reviews_teamMemberId_idx" ON "performance_reviews"("teamMemberId");

-- CreateIndex
CREATE INDEX "performance_reviews_status_teamMemberId_idx" ON "performance_reviews"("status", "teamMemberId");

-- CreateIndex
CREATE INDEX "performance_reviews_year_quarter_idx" ON "performance_reviews"("year", "quarter");

-- CreateIndex
CREATE INDEX "performance_reviews_createdAt_idx" ON "performance_reviews"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "performance_reviews_teamMemberId_quarter_year_key" ON "performance_reviews"("teamMemberId", "quarter", "year");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_performedBy_idx" ON "audit_logs"("performedBy");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "app_users_deletedAt_idx" ON "app_users"("deletedAt");

-- CreateIndex
CREATE INDEX "job_grades_deletedAt_idx" ON "job_grades"("deletedAt");

-- CreateIndex
CREATE INDEX "team_functions_deletedAt_idx" ON "team_functions"("deletedAt");

-- AddForeignKey
ALTER TABLE "job_titles" ADD CONSTRAINT "job_titles_teamFunctionId_fkey" FOREIGN KEY ("teamFunctionId") REFERENCES "team_functions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_activities" ADD CONSTRAINT "business_activities_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "g_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_activities" ADD CONSTRAINT "business_activities_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "app_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "g_teams" ADD CONSTRAINT "g_teams_teamFunctionId_fkey" FOREIGN KEY ("teamFunctionId") REFERENCES "team_functions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "g_teams" ADD CONSTRAINT "g_teams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "g_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_jobGradeId_fkey" FOREIGN KEY ("jobGradeId") REFERENCES "job_grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_ratings" ADD CONSTRAINT "member_ratings_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_ratings" ADD CONSTRAINT "member_ratings_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "business_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "structured_feedback" ADD CONSTRAINT "structured_feedback_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_comments" ADD CONSTRAINT "member_comments_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

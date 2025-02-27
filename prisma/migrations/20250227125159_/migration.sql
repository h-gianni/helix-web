/*
  Warnings:

  - The values [BUSINESS_ACTIVITY,MEMBER_RATING] on the enum `EntityType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `activity_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `business_activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `member_ratings` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BusinessActionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- AlterEnum
BEGIN;
CREATE TYPE "EntityType_new" AS ENUM ('APP_USER', 'TEAM_FUNCTION', 'JOB_TITLE', 'JOB_GRADE', 'BUSINESS_ACTION', 'G_TEAM', 'TEAM_MEMBER', 'MEMBER_SCORE', 'STRUCTURED_FEEDBACK', 'MEMBER_COMMENT', 'PERFORMANCE_REVIEW');
ALTER TABLE "audit_logs" ALTER COLUMN "entityType" TYPE "EntityType_new" USING ("entityType"::text::"EntityType_new");
ALTER TYPE "EntityType" RENAME TO "EntityType_old";
ALTER TYPE "EntityType_new" RENAME TO "EntityType";
DROP TYPE "EntityType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "business_activities" DROP CONSTRAINT "business_activities_activityId_fkey";

-- DropForeignKey
ALTER TABLE "business_activities" DROP CONSTRAINT "business_activities_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "business_activities" DROP CONSTRAINT "business_activities_teamId_fkey";

-- DropForeignKey
ALTER TABLE "member_ratings" DROP CONSTRAINT "member_ratings_activityId_fkey";

-- DropForeignKey
ALTER TABLE "member_ratings" DROP CONSTRAINT "member_ratings_teamMemberId_fkey";

-- AlterTable
ALTER TABLE "org_name" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "activities";

-- DropTable
DROP TABLE "activity_categories";

-- DropTable
DROP TABLE "business_activities";

-- DropTable
DROP TABLE "member_ratings";

-- DropEnum
DROP TYPE "BusinessActivityStatus";

-- CreateTable
CREATE TABLE "action_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "action_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "impactScale" SMALLINT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_actions" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "BusinessActionStatus" NOT NULL DEFAULT 'ACTIVE',
    "dueDate" TIMESTAMP(3),
    "teamId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "org_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_scores" (
    "id" TEXT NOT NULL,
    "value" SMALLINT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "action_categories_name_key" ON "action_categories"("name");

-- CreateIndex
CREATE INDEX "actions_categoryId_idx" ON "actions"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "actions_name_categoryId_key" ON "actions"("name", "categoryId");

-- CreateIndex
CREATE INDEX "org_actions_teamId_createdAt_idx" ON "org_actions"("teamId", "createdAt");

-- CreateIndex
CREATE INDEX "org_actions_actionId_idx" ON "org_actions"("actionId");

-- CreateIndex
CREATE INDEX "org_actions_status_idx" ON "org_actions"("status");

-- CreateIndex
CREATE INDEX "org_actions_createdBy_idx" ON "org_actions"("createdBy");

-- CreateIndex
CREATE INDEX "org_actions_deletedAt_idx" ON "org_actions"("deletedAt");

-- CreateIndex
CREATE INDEX "member_scores_teamMemberId_idx" ON "member_scores"("teamMemberId");

-- CreateIndex
CREATE INDEX "member_scores_actionId_idx" ON "member_scores"("actionId");

-- CreateIndex
CREATE INDEX "member_scores_createdAt_idx" ON "member_scores"("createdAt");

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "action_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_actions" ADD CONSTRAINT "org_actions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_actions" ADD CONSTRAINT "org_actions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "g_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_actions" ADD CONSTRAINT "org_actions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "app_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_scores" ADD CONSTRAINT "member_scores_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_scores" ADD CONSTRAINT "member_scores_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "org_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

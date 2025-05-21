-- CreateEnum
CREATE TYPE "TeamMemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ONLEAVE');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ACKNOWLEDGED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "BusinessActionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('APP_USER', 'TEAM_FUNCTION', 'JOB_TITLE', 'JOB_GRADE', 'BUSINESS_ACTION', 'G_TEAM', 'TEAM_MEMBER', 'MEMBER_SCORE', 'STRUCTURED_FEEDBACK', 'MEMBER_COMMENT', 'PERFORMANCE_REVIEW');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'STATUS_CHANGE');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PREMIUM', 'ENTERPRISE');

-- CreateTable
CREATE TABLE "app_users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100),
    "clerkId" TEXT,
    "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),
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
CREATE TABLE "job_grades" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "grade" VARCHAR(50) NOT NULL,
    "typicalResponsibilities" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "customFields" JSONB,

    CONSTRAINT "job_grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
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
    "teamId" TEXT,
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
CREATE TABLE "member_scores" (
    "id" TEXT NOT NULL,
    "value" SMALLINT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_scores_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "org_name" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "siteDomain" TEXT,

    CONSTRAINT "org_name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_global_actions" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "status" "BusinessActionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdBy" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "org_global_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_team_actions" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "status" "BusinessActionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdBy" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "org_team_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_users_email_key" ON "app_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "app_users_clerkId_key" ON "app_users"("clerkId");

-- CreateIndex
CREATE INDEX "app_users_deletedAt_idx" ON "app_users"("deletedAt");

-- CreateIndex
CREATE INDEX "app_users_subscriptionTier_idx" ON "app_users"("subscriptionTier");

-- CreateIndex
CREATE UNIQUE INDEX "team_functions_name_key" ON "team_functions"("name");

-- CreateIndex
CREATE INDEX "team_functions_deletedAt_idx" ON "team_functions"("deletedAt");

-- CreateIndex
CREATE INDEX "job_titles_teamFunctionId_idx" ON "job_titles"("teamFunctionId");

-- CreateIndex
CREATE INDEX "job_titles_deletedAt_idx" ON "job_titles"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "job_titles_name_teamFunctionId_key" ON "job_titles"("name", "teamFunctionId");

-- CreateIndex
CREATE UNIQUE INDEX "job_grades_level_key" ON "job_grades"("level");

-- CreateIndex
CREATE UNIQUE INDEX "job_grades_grade_key" ON "job_grades"("grade");

-- CreateIndex
CREATE INDEX "job_grades_deletedAt_idx" ON "job_grades"("deletedAt");

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
CREATE INDEX "g_teams_teamFunctionId_idx" ON "g_teams"("teamFunctionId");

-- CreateIndex
CREATE INDEX "g_teams_ownerId_idx" ON "g_teams"("ownerId");

-- CreateIndex
CREATE INDEX "g_teams_deletedAt_idx" ON "g_teams"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "g_teams_name_ownerId_key" ON "g_teams"("name", "ownerId");

-- CreateIndex
CREATE INDEX "team_members_userId_idx" ON "team_members"("userId");

-- CreateIndex
CREATE INDEX "team_members_jobGradeId_idx" ON "team_members"("jobGradeId");

-- CreateIndex
CREATE INDEX "team_members_status_idx" ON "team_members"("status");

-- CreateIndex
CREATE INDEX "team_members_deletedAt_idx" ON "team_members"("deletedAt");

-- CreateIndex
CREATE INDEX "member_scores_teamMemberId_idx" ON "member_scores"("teamMemberId");

-- CreateIndex
CREATE INDEX "member_scores_actionId_idx" ON "member_scores"("actionId");

-- CreateIndex
CREATE INDEX "member_scores_createdAt_idx" ON "member_scores"("createdAt");

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
CREATE INDEX "org_global_actions_actionId_idx" ON "org_global_actions"("actionId");

-- CreateIndex
CREATE INDEX "org_global_actions_createdBy_idx" ON "org_global_actions"("createdBy");

-- CreateIndex
CREATE INDEX "org_global_actions_orgId_idx" ON "org_global_actions"("orgId");

-- CreateIndex
CREATE INDEX "org_global_actions_deletedAt_idx" ON "org_global_actions"("deletedAt");

-- CreateIndex
CREATE INDEX "org_team_actions_actionId_idx" ON "org_team_actions"("actionId");

-- CreateIndex
CREATE INDEX "org_team_actions_createdBy_idx" ON "org_team_actions"("createdBy");

-- CreateIndex
CREATE INDEX "org_team_actions_orgId_idx" ON "org_team_actions"("orgId");

-- CreateIndex
CREATE INDEX "org_team_actions_deletedAt_idx" ON "org_team_actions"("deletedAt");

-- AddForeignKey
ALTER TABLE "job_titles" ADD CONSTRAINT "job_titles_teamFunctionId_fkey" FOREIGN KEY ("teamFunctionId") REFERENCES "team_functions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "action_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_actions" ADD CONSTRAINT "org_actions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_actions" ADD CONSTRAINT "org_actions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "g_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_actions" ADD CONSTRAINT "org_actions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "app_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "g_teams" ADD CONSTRAINT "g_teams_teamFunctionId_fkey" FOREIGN KEY ("teamFunctionId") REFERENCES "team_functions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "g_teams" ADD CONSTRAINT "g_teams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "g_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_jobGradeId_fkey" FOREIGN KEY ("jobGradeId") REFERENCES "job_grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_scores" ADD CONSTRAINT "member_scores_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_scores" ADD CONSTRAINT "member_scores_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "org_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "structured_feedback" ADD CONSTRAINT "structured_feedback_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_comments" ADD CONSTRAINT "member_comments_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_name" ADD CONSTRAINT "org_name_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_global_actions" ADD CONSTRAINT "org_global_actions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_global_actions" ADD CONSTRAINT "org_global_actions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "app_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_global_actions" ADD CONSTRAINT "org_global_actions_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org_name"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_team_actions" ADD CONSTRAINT "org_team_actions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_team_actions" ADD CONSTRAINT "org_team_actions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "app_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_team_actions" ADD CONSTRAINT "org_team_actions_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org_name"("id") ON DELETE CASCADE ON UPDATE CASCADE;

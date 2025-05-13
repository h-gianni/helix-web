-- AlterTable
ALTER TABLE "action_categories" ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT false;

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
ALTER TABLE "org_global_actions" ADD CONSTRAINT "org_global_actions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_global_actions" ADD CONSTRAINT "org_global_actions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "app_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_global_actions" ADD CONSTRAINT "org_global_actions_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org_name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_team_actions" ADD CONSTRAINT "org_team_actions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_team_actions" ADD CONSTRAINT "org_team_actions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "app_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_team_actions" ADD CONSTRAINT "org_team_actions_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org_name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

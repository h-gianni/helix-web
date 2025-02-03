/*
  Warnings:

  - You are about to drop the column `feedback` on the `member_ratings` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PREMIUM', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "app_users" ADD COLUMN     "subscriptionEnd" TIMESTAMP(3),
ADD COLUMN     "subscriptionStart" TIMESTAMP(3),
ADD COLUMN     "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE';

-- AlterTable
ALTER TABLE "member_ratings" DROP COLUMN "feedback";

-- CreateIndex
CREATE INDEX "app_users_subscriptionTier_idx" ON "app_users"("subscriptionTier");

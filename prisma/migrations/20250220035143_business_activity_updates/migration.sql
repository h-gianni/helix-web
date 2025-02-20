/*
  Warnings:

  - You are about to drop the column `category` on the `business_activities` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `business_activities` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `business_activities` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "business_activities_name_key";

-- AlterTable
ALTER TABLE "business_activities" DROP COLUMN "category",
DROP COLUMN "description",
DROP COLUMN "name";

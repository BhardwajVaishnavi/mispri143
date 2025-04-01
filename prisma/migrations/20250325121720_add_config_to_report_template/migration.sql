/*
  Warnings:

  - You are about to drop the column `content` on the `ReportTemplate` table. All the data in the column will be lost.
  - Added the required column `config` to the `ReportTemplate` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `ReportTemplate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `ReportTemplate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ReportTemplate" DROP COLUMN "content",
ADD COLUMN     "config" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL;

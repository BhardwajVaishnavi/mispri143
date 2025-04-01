/*
  Warnings:

  - You are about to drop the column `location` on the `Store` table. All the data in the column will be lost.
  - Changed the type of `config` on the `ReportTemplate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `address` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerName` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReportTemplate" DROP COLUMN "config",
ADD COLUMN     "config" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "managerName" TEXT NOT NULL,
ADD COLUMN     "operatingHours" JSONB,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "size" DOUBLE PRECISION,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "storeType" TEXT NOT NULL DEFAULT 'RETAIL',
ADD COLUMN     "taxIdentificationNumber" TEXT;

-- CreateIndex
CREATE INDEX "Store_status_idx" ON "Store"("status");

-- CreateIndex
CREATE INDEX "Store_storeType_idx" ON "Store"("storeType");

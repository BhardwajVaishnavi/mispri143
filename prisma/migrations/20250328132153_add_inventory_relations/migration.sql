/*
  Warnings:

  - You are about to drop the column `batchNumber` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `binNumber` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `lastStockCheck` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `maximumStock` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `unitCost` on the `Inventory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storeId,productId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Inventory_productId_storeId_key";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "batchNumber",
DROP COLUMN "binNumber",
DROP COLUMN "createdAt",
DROP COLUMN "expiryDate",
DROP COLUMN "lastStockCheck",
DROP COLUMN "location",
DROP COLUMN "maximumStock",
DROP COLUMN "notes",
DROP COLUMN "status",
DROP COLUMN "unitCost",
ALTER COLUMN "quantity" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_storeId_productId_key" ON "Inventory"("storeId", "productId");

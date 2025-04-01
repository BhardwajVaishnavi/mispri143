/*
  Warnings:

  - The primary key for the `Inventory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `inventoryId` on the `InventoryAlert` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `InventoryHistory` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `StockAdjustment` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `StockMovement` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `StockReservation` table. All the data in the column will be lost.
  - Added the required column `productId` to the `InventoryAlert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `InventoryAlert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `InventoryHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `InventoryHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `StockAdjustment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `StockAdjustment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `StockMovement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `StockMovement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `StockReservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `StockReservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InventoryAlert" DROP CONSTRAINT "InventoryAlert_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryHistory" DROP CONSTRAINT "InventoryHistory_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "StockAdjustment" DROP CONSTRAINT "StockAdjustment_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "StockReservation" DROP CONSTRAINT "StockReservation_inventoryId_fkey";

-- DropIndex
DROP INDEX "Inventory_storeId_productId_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_pkey",
ADD CONSTRAINT "Inventory_pkey" PRIMARY KEY ("storeId", "productId");

-- AlterTable
ALTER TABLE "InventoryAlert" DROP COLUMN "inventoryId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InventoryHistory" DROP COLUMN "inventoryId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "availableForDelivery" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "availableForPickup" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "bestseller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deliveryFee" DOUBLE PRECISION,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "freeDelivery" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leadTime" INTEGER,
ADD COLUMN     "maximumOrderQuantity" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "minimumOrderQuantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "new" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "occasions" TEXT[],
ADD COLUMN     "salePrice" DOUBLE PRECISION,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "subcategory" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "taxRate" DOUBLE PRECISION,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "StockAdjustment" DROP COLUMN "inventoryId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StockMovement" DROP COLUMN "inventoryId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StockReservation" DROP COLUMN "inventoryId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "storeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "salePrice" DOUBLE PRECISION,
    "size" TEXT,
    "color" TEXT,
    "flavor" TEXT,
    "weight" DOUBLE PRECISION,
    "dimensions" JSONB,
    "images" TEXT[],
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCustomizationOption" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "maxLength" INTEGER,
    "additionalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ProductCustomizationOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductIngredient" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "allergen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionalInfo" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "calories" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "allergens" TEXT[],

    CONSTRAINT "NutritionalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareInstructions" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "wateringFrequency" TEXT,
    "sunlightNeeds" TEXT,
    "temperature" TEXT,
    "shelfLife" TEXT,
    "storageInfo" TEXT,
    "additionalNotes" TEXT,

    CONSTRAINT "CareInstructions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NutritionalInfo_productId_key" ON "NutritionalInfo"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "CareInstructions_productId_key" ON "CareInstructions"("productId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryHistory" ADD CONSTRAINT "InventoryHistory_storeId_productId_fkey" FOREIGN KEY ("storeId", "productId") REFERENCES "Inventory"("storeId", "productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_storeId_productId_fkey" FOREIGN KEY ("storeId", "productId") REFERENCES "Inventory"("storeId", "productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustment" ADD CONSTRAINT "StockAdjustment_storeId_productId_fkey" FOREIGN KEY ("storeId", "productId") REFERENCES "Inventory"("storeId", "productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockReservation" ADD CONSTRAINT "StockReservation_storeId_productId_fkey" FOREIGN KEY ("storeId", "productId") REFERENCES "Inventory"("storeId", "productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAlert" ADD CONSTRAINT "InventoryAlert_storeId_productId_fkey" FOREIGN KEY ("storeId", "productId") REFERENCES "Inventory"("storeId", "productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCustomizationOption" ADD CONSTRAINT "ProductCustomizationOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductIngredient" ADD CONSTRAINT "ProductIngredient_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionalInfo" ADD CONSTRAINT "NutritionalInfo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareInstructions" ADD CONSTRAINT "CareInstructions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

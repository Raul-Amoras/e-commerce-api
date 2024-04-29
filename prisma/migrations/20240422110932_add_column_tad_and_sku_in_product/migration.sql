/*
  Warnings:

  - Added the required column `sku` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sku" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProductTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductTag_name_key" ON "ProductTag"("name");

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

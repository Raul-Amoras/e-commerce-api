/*
  Warnings:

  - You are about to drop the column `product_id` on the `ProductTag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductTag" DROP CONSTRAINT "ProductTag_product_id_fkey";

-- AlterTable
ALTER TABLE "ProductTag" DROP COLUMN "product_id";

-- CreateTable
CREATE TABLE "_ProductToProductTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToProductTag_AB_unique" ON "_ProductToProductTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToProductTag_B_index" ON "_ProductToProductTag"("B");

-- AddForeignKey
ALTER TABLE "_ProductToProductTag" ADD CONSTRAINT "_ProductToProductTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductTag" ADD CONSTRAINT "_ProductToProductTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

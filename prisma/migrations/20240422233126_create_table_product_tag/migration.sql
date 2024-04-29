/*
  Warnings:

  - You are about to drop the column `active` on the `ProductTag` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ProductTag` table. All the data in the column will be lost.
  - You are about to drop the `_ProductToProductTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_id` to the `ProductTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `ProductTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProductToProductTag" DROP CONSTRAINT "_ProductToProductTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToProductTag" DROP CONSTRAINT "_ProductToProductTag_B_fkey";

-- DropIndex
DROP INDEX "ProductTag_name_key";

-- AlterTable
ALTER TABLE "ProductTag" DROP COLUMN "active",
DROP COLUMN "name",
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "tag_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ProductToProductTag";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

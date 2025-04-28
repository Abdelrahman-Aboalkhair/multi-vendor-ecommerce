/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Category_name_slug_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "description",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "vendorId" TEXT;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

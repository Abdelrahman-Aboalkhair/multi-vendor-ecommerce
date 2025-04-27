/*
  Warnings:

  - The `logoFiles` column on the `Vendor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "logoFiles",
ADD COLUMN     "logoFiles" TEXT[];

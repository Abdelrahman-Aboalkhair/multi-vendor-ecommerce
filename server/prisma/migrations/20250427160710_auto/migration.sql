/*
  Warnings:

  - You are about to drop the column `logo` on the `Vendor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "logo",
ADD COLUMN     "logoFiles" TEXT;

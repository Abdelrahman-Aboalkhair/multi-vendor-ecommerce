-- CreateEnum
CREATE TYPE "VENDOR_STATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PAYOUT_STATUS" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterEnum
ALTER TYPE "ROLE" ADD VALUE 'VENDOR';

-- DropIndex
DROP INDEX "CartItem_cartId_productId_idx";

-- DropIndex
DROP INDEX "Order_userId_idx";

-- DropIndex
DROP INDEX "OrderItem_orderId_productId_idx";

-- DropIndex
DROP INDEX "Product_name_slug_idx";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "vendorId" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "vendorId" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "vendorId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "vendorId" TEXT;

-- AlterTable
ALTER TABLE "Restock" ADD COLUMN     "vendorId" TEXT;

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "vendorId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "platformCommission" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "vendorPayoutAmount" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "contact" TEXT,
    "status" "VENDOR_STATUS" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PAYOUT_STATUS" NOT NULL DEFAULT 'PENDING',
    "payoutDate" TIMESTAMP(3),
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_userId_key" ON "Vendor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_storeName_key" ON "Vendor"("storeName");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_slug_key" ON "Vendor"("slug");

-- CreateIndex
CREATE INDEX "Vendor_userId_storeName_slug_idx" ON "Vendor"("userId", "storeName", "slug");

-- CreateIndex
CREATE INDEX "Payout_vendorId_idx" ON "Payout"("vendorId");

-- CreateIndex
CREATE INDEX "CartItem_cartId_productId_vendorId_idx" ON "CartItem"("cartId", "productId", "vendorId");

-- CreateIndex
CREATE INDEX "Order_userId_vendorId_idx" ON "Order"("userId", "vendorId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_productId_vendorId_idx" ON "OrderItem"("orderId", "productId", "vendorId");

-- CreateIndex
CREATE INDEX "Product_name_slug_vendorId_idx" ON "Product"("name", "slug", "vendorId");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restock" ADD CONSTRAINT "Restock_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "qr_code" TEXT,
ADD COLUMN     "qr_code_scan" TIMESTAMP(3);

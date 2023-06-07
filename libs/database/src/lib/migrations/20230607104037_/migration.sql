/*
  Warnings:

  - You are about to drop the column `qr_code` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `qr_code_scan` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "qr_code",
DROP COLUMN "qr_code_scan";

-- CreateTable
CREATE TABLE "QRCode" (
    "id" SERIAL NOT NULL,
    "order_item_id" INTEGER,
    "qr_code" TEXT NOT NULL,
    "qr_code_scan" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QRCode" ADD CONSTRAINT "QRCode_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

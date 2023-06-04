/*
  Warnings:

  - Added the required column `snipcart_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `card_last4` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `card_type` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "snipcart_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "card_last4" SMALLINT NOT NULL,
ADD COLUMN     "card_type" TEXT NOT NULL,
ADD COLUMN     "payment_method" TEXT NOT NULL;

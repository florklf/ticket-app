/*
  Warnings:

  - Added the required column `billing_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billing_city` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billing_country` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billing_zip` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_city` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_country` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_zip` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "billing_address" TEXT NOT NULL,
ADD COLUMN     "billing_city" TEXT NOT NULL,
ADD COLUMN     "billing_country" TEXT NOT NULL,
ADD COLUMN     "billing_zip" TEXT NOT NULL,
ADD COLUMN     "shipping_address" TEXT NOT NULL,
ADD COLUMN     "shipping_city" TEXT NOT NULL,
ADD COLUMN     "shipping_country" TEXT NOT NULL,
ADD COLUMN     "shipping_zip" TEXT NOT NULL;

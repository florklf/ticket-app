/*
  Warnings:

  - Added the required column `qr_code_decoded` to the `QRCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QRCode" ADD COLUMN     "qr_code_decoded" TEXT NOT NULL;

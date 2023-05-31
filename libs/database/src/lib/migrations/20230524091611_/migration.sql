/*
  Warnings:

  - Added the required column `capacity` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `available_seats` to the `SeatTypesForEvents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "capacity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SeatTypesForEvents" ADD COLUMN     "available_seats" INTEGER NOT NULL;

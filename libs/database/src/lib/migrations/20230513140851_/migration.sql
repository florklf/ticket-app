/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `SeatType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SeatType_name_key" ON "SeatType"("name");

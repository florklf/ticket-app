/*
  Warnings:

  - You are about to drop the `SeatTypesForEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_seat_type_id_fkey";

-- DropForeignKey
ALTER TABLE "SeatTypesForEvents" DROP CONSTRAINT "SeatTypesForEvents_event_id_fkey";

-- DropForeignKey
ALTER TABLE "SeatTypesForEvents" DROP CONSTRAINT "SeatTypesForEvents_seat_type_id_fkey";

-- DropTable
DROP TABLE "SeatTypesForEvents";

-- CreateTable
CREATE TABLE "EventSeatType" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "available_seats" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "seat_type_id" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventSeatType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_order_id_key" ON "Payment"("order_id");

-- AddForeignKey
ALTER TABLE "EventSeatType" ADD CONSTRAINT "EventSeatType_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSeatType" ADD CONSTRAINT "EventSeatType_seat_type_id_fkey" FOREIGN KEY ("seat_type_id") REFERENCES "SeatType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_seat_type_id_fkey" FOREIGN KEY ("seat_type_id") REFERENCES "EventSeatType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

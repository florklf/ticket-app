-- DropForeignKey
ALTER TABLE "SeatType" DROP CONSTRAINT "SeatType_place_id_fkey";

-- AddForeignKey
ALTER TABLE "SeatType" ADD CONSTRAINT "SeatType_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

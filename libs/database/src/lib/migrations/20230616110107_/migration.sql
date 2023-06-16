/*
  Warnings:

  - Added the required column `type_id` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "type_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

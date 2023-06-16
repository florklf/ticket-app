/*
  Warnings:

  - You are about to drop the column `type` on the `Event` table. All the data in the column will be lost.
  - Added the required column `type_id` to the `Genre` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `Genre` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "type_id" INTEGER NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropEnum
DROP TYPE "EnumGenre";

-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "name" "EnumEventType" NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Genre" ADD CONSTRAINT "Genre_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

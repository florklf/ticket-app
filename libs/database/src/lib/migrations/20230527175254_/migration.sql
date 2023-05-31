/*
  Warnings:

  - Changed the type of `name` on the `Genre` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "name",
ADD COLUMN     "name" "EnumGenre" NOT NULL;

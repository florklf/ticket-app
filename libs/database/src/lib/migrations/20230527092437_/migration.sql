/*
  Warnings:

  - The values [MEETING,OTHER] on the enum `EnumEventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnumEventType_new" AS ENUM ('CONCERT', 'SPECTACLE', 'FESTIVAL', 'CONFERENCE');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EnumEventType_new" USING ("type"::text::"EnumEventType_new");
ALTER TYPE "EnumEventType" RENAME TO "EnumEventType_old";
ALTER TYPE "EnumEventType_new" RENAME TO "EnumEventType";
DROP TYPE "EnumEventType_old";
COMMIT;

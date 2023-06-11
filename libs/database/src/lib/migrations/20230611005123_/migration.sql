/*
  Warnings:

  - You are about to drop the `_ArtistToEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventToGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArtistToEvent" DROP CONSTRAINT "_ArtistToEvent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistToEvent" DROP CONSTRAINT "_ArtistToEvent_B_fkey";

-- DropForeignKey
ALTER TABLE "_EventToGenre" DROP CONSTRAINT "_EventToGenre_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToGenre" DROP CONSTRAINT "_EventToGenre_B_fkey";

-- DropTable
DROP TABLE "_ArtistToEvent";

-- DropTable
DROP TABLE "_EventToGenre";

-- CreateTable
CREATE TABLE "EventArtist" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "artist_id" INTEGER NOT NULL,

    CONSTRAINT "EventArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventGenre" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "EventGenre_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventArtist" ADD CONSTRAINT "EventArtist_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventArtist" ADD CONSTRAINT "EventArtist_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventGenre" ADD CONSTRAINT "EventGenre_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventGenre" ADD CONSTRAINT "EventGenre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

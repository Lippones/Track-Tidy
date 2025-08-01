-- CreateEnum
CREATE TYPE "PlaylistType" AS ENUM ('PLAYLIST', 'LIKED');

-- CreateTable
CREATE TABLE "playlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "type" "PlaylistType" NOT NULL DEFAULT 'PLAYLIST',
    "totalTracks" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "playlist" ADD CONSTRAINT "playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

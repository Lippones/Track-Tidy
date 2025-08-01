/*
  Warnings:

  - You are about to drop the `playlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PlaylistJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "playlist" DROP CONSTRAINT "playlist_userId_fkey";

-- DropTable
DROP TABLE "playlist";

-- CreateTable
CREATE TABLE "playlist_job" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "status" "PlaylistJobStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "resultPlaylistId" TEXT,

    CONSTRAINT "playlist_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_job_input" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "type" "PlaylistType" NOT NULL DEFAULT 'PLAYLIST',
    "totalTracks" INTEGER,

    CONSTRAINT "playlist_job_input_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "playlist_job_userId_status_idx" ON "playlist_job"("userId", "status");

-- CreateIndex
CREATE INDEX "playlist_job_input_playlistId_name_jobId_idx" ON "playlist_job_input"("playlistId", "name", "jobId");

-- AddForeignKey
ALTER TABLE "playlist_job" ADD CONSTRAINT "playlist_job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_job_input" ADD CONSTRAINT "playlist_job_input_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "playlist_job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

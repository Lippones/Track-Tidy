-- AlterTable
ALTER TABLE "playlist_job" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "playlist_job_result" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "type" "PlaylistType" NOT NULL DEFAULT 'PLAYLIST',
    "totalTracks" INTEGER,

    CONSTRAINT "playlist_job_result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "playlist_job_result_playlistId_name_jobId_idx" ON "playlist_job_result"("playlistId", "name", "jobId");

-- AddForeignKey
ALTER TABLE "playlist_job_result" ADD CONSTRAINT "playlist_job_result_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "playlist_job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

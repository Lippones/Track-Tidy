-- AlterEnum
ALTER TYPE "PlaylistJobStatus" ADD VALUE 'DRAFT';

-- AlterTable
ALTER TABLE "playlist_job" ALTER COLUMN "prompt" DROP NOT NULL;

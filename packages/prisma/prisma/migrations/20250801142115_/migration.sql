/*
  Warnings:

  - You are about to drop the column `image` on the `playlist_job_result` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `playlist_job_result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "playlist_job_result" DROP COLUMN "image",
DROP COLUMN "type",
ADD COLUMN     "description" TEXT;

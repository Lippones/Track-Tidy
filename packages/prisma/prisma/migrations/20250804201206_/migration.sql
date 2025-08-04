/*
  Warnings:

  - You are about to alter the column `totalCost` on the `TokenUsage` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `embeddingCost` to the `TokenUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelCost` to the `TokenUsage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenUsage" ADD COLUMN     "embeddingCost" INTEGER NOT NULL,
ADD COLUMN     "modelCost" INTEGER NOT NULL,
ALTER COLUMN "totalCost" SET DATA TYPE INTEGER;

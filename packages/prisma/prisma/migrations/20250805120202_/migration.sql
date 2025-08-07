/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CreditPackage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CreditPackage_name_key" ON "CreditPackage"("name");

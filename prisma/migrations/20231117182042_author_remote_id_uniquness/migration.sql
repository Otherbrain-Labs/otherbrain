/*
  Warnings:

  - A unique constraint covering the columns `[remoteId]` on the table `Author` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Author_remoteId_key" ON "Author"("remoteId");

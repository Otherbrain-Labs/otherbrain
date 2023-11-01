/*
  Warnings:

  - The `numParameters` column on the `Model` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[remoteId]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `arch` on the `Model` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Model_authorId_slug_key";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "numParameters",
ADD COLUMN     "numParameters" INTEGER,
DROP COLUMN "arch",
ADD COLUMN     "arch" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Arch";

-- CreateIndex
CREATE UNIQUE INDEX "Model_remoteId_key" ON "Model"("remoteId");

/*
  Warnings:

  - The values [mpt] on the enum `Arch` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `blurb` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `publisherName` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `publisherSocialUrl` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `repository` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `repositoryUrl` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `sha256checksum` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `sizeBytes` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `canonicalUrl` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `datePublished` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `downloadUrl` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `trainedFor` on the `Model` table. All the data in the column will be lost.
  - Added the required column `remoteId` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ggufId` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastModifiedDate` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remoteId` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Arch_new" AS ENUM ('llama', 'starcoder', 'mistral', 'falcon', 'tinyllama', 'aquila', 'other');
ALTER TABLE "Model" ALTER COLUMN "arch" TYPE "Arch_new" USING ("arch"::text::"Arch_new");
ALTER TYPE "Arch" RENAME TO "Arch_old";
ALTER TYPE "Arch_new" RENAME TO "Arch";
DROP TYPE "Arch_old";
COMMIT;

-- DropIndex
DROP INDEX "Author_name_key";

-- AlterTable
ALTER TABLE "Author" DROP COLUMN "blurb",
DROP COLUMN "url",
ADD COLUMN     "remoteId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "publisherName",
DROP COLUMN "publisherSocialUrl",
DROP COLUMN "repository",
DROP COLUMN "repositoryUrl",
DROP COLUMN "sha256checksum",
DROP COLUMN "sizeBytes",
DROP COLUMN "url";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "canonicalUrl",
DROP COLUMN "datePublished",
DROP COLUMN "description",
DROP COLUMN "downloadUrl",
DROP COLUMN "trainedFor",
ADD COLUMN     "ggufId" TEXT NOT NULL,
ADD COLUMN     "lastModifiedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "license" TEXT,
ADD COLUMN     "remoteId" TEXT NOT NULL,
ALTER COLUMN "numParameters" DROP NOT NULL;

-- DropEnum
DROP TYPE "TrainedFor";

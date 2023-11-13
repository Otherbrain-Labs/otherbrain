/*
  Warnings:

  - You are about to drop the column `createdAt` on the `HumanFeedbackMessage` table. All the data in the column will be lost.
  - Made the column `lastSystemPrompt` on table `HumanFeedback` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `index` to the `HumanFeedbackMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HumanFeedback" ALTER COLUMN "lastSystemPrompt" SET NOT NULL;

-- AlterTable
ALTER TABLE "HumanFeedbackMessage" DROP COLUMN "createdAt",
ADD COLUMN     "index" INTEGER NOT NULL;

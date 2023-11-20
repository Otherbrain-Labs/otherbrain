/*
  Warnings:

  - A unique constraint covering the columns `[numId]` on the table `HumanFeedback` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numId` to the `HumanFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HumanFeedback` ADD COLUMN `numId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `HumanFeedbackTag` (
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `HumanFeedbackTag_name_key`(`name`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_HumanFeedbackToHumanFeedbackTag` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_HumanFeedbackToHumanFeedbackTag_AB_unique`(`A`, `B`),
    INDEX `_HumanFeedbackToHumanFeedbackTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `HumanFeedback_numId_key` ON `HumanFeedback`(`numId`);

-- CreateIndex
CREATE INDEX `HumanFeedback_numId_idx` ON `HumanFeedback`(`numId`);

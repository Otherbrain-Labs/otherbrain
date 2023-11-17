-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refreshToken` TEXT NULL,
    `refreshTokenExpiresIn` INTEGER NULL,
    `accessToken` TEXT NULL,
    `expiresAt` INTEGER NULL,
    `tokenType` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `idToken` TEXT NULL,
    `sessionState` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Author` (
    `id` VARCHAR(191) NOT NULL,
    `remoteId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Author_remoteId_key`(`remoteId`),
    UNIQUE INDEX `Author_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Model` (
    `id` VARCHAR(191) NOT NULL,
    `remoteId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastModifiedDate` DATETIME(3) NOT NULL,
    `numParameters` INTEGER NULL,
    `arch` VARCHAR(191) NOT NULL,
    `license` VARCHAR(191) NULL,
    `ggufId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `average` DOUBLE NULL,
    `arc` DOUBLE NULL,
    `hellaswag` DOUBLE NULL,
    `mmlu` DOUBLE NULL,
    `truthfulqa` DOUBLE NULL,
    `drop` DOUBLE NULL,
    `gsm8k` DOUBLE NULL,
    `winogrande` DOUBLE NULL,
    `avgStars` DOUBLE NULL,
    `numReviews` INTEGER NULL,
    `numHumanFeedback` INTEGER NULL,

    UNIQUE INDEX `Model_remoteId_key`(`remoteId`),
    INDEX `Model_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `quantization` VARCHAR(191) NOT NULL,
    `format` VARCHAR(191) NOT NULL,
    `modelId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `File_name_key`(`name`),
    INDEX `File_modelId_idx`(`modelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `stars` INTEGER NOT NULL,
    `text` LONGTEXT NOT NULL,
    `externalName` VARCHAR(191) NULL,
    `externalUrl` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `modelId` VARCHAR(191) NOT NULL,

    INDEX `Review_modelId_idx`(`modelId`),
    INDEX `Review_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HumanFeedback` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modelName` VARCHAR(191) NOT NULL,
    `promptTemplate` VARCHAR(191) NOT NULL,
    `lastSystemPrompt` VARCHAR(191) NOT NULL,
    `client` VARCHAR(191) NOT NULL,
    `modelId` VARCHAR(191) NULL,

    INDEX `HumanFeedback_modelId_idx`(`modelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HumanFeedbackMessage` (
    `id` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL,
    `fromUser` BOOLEAN NOT NULL,
    `text` LONGTEXT NOT NULL,
    `humanFeedbackId` VARCHAR(191) NOT NULL,

    INDEX `HumanFeedbackMessage_humanFeedbackId_idx`(`humanFeedbackId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

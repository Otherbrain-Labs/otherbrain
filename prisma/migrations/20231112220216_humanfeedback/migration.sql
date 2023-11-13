-- CreateTable
CREATE TABLE "HumanFeedback" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelName" TEXT NOT NULL,
    "promptTemplate" TEXT NOT NULL,
    "lastSystemPrompt" TEXT,
    "client" TEXT NOT NULL,

    CONSTRAINT "HumanFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HumanFeedbackMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromUser" BOOLEAN NOT NULL,
    "text" TEXT NOT NULL,
    "humanFeedbackId" TEXT NOT NULL,

    CONSTRAINT "HumanFeedbackMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HumanFeedbackMessage" ADD CONSTRAINT "HumanFeedbackMessage_humanFeedbackId_fkey" FOREIGN KEY ("humanFeedbackId") REFERENCES "HumanFeedback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

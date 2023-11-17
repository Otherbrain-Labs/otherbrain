-- AlterTable
ALTER TABLE "HumanFeedback" ADD COLUMN     "modelId" TEXT;

-- AddForeignKey
ALTER TABLE "HumanFeedback" ADD CONSTRAINT "HumanFeedback_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;

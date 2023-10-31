import prisma from "../../lib/prisma";
import scores from "../data/scores.json";

export async function loadScores() {
  let count = 0;
  for (const score of scores) {
    try {
      var dbModel = await prisma.model.findFirst({
        where: { remoteId: score.model },
      });

      if (dbModel) {
        console.log(`Updating scores for ${score.model}`);
        count++;
      } else {
        continue;
      }

      await prisma.model.update({
        where: { id: dbModel.id },
        data: {
          average: parseFloat(score.average),
          arc: parseFloat(score.arc!),
          hellaswag: parseFloat(score.hellaswag!),
          mmlu: parseFloat(score.mmlu!),
          truthfulqa: parseFloat(score.truthfulqa!),
        },
      });
    } catch (error) {
      console.log(score);
      throw error;
    }
  }
  console.log(`Updated ${count} models`);
}

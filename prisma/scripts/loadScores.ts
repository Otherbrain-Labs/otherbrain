import prisma from "../../lib/prisma";
import scores from "../data/scores.json";

export async function loadScores() {
  const [originalCount, remoteIds] = await prisma.$transaction([
    prisma.model.count({
      where: { average: { not: null } },
    }),
    prisma.model.findMany({
      select: { remoteId: true },
    }),
  ]);

  let count = 0;
  const remoteIdsFlat = remoteIds.map((model) => model.remoteId);
  for (const score of scores) {
    if (!remoteIdsFlat.includes(score.model)) {
      continue;
    }
    try {
      await prisma.model.updateMany({
        where: { remoteId: score.model },
        data: {
          average: parseFloat(score.average),
          arc: parseFloat(score.arc!),
          hellaswag: parseFloat(score.hellaswag!),
          mmlu: parseFloat(score.mmlu!),
          truthfulqa: parseFloat(score.truthfulqa!),
        },
      });
      count++;
    } catch (error) {
      console.error(error, score.model);
    }
  }
  console.log(
    `Added ${count - originalCount} new scores, updated ${count} models total`
  );
}

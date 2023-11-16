import prisma from "@/lib/prisma";
import { Model } from "./page";
import Sample from "./sample";

async function loadHumanFeedback(modelId: string) {
  return prisma.humanFeedback.findMany({
    where: {
      modelId,
    },
    include: {
      messages: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export type HumanFeedback = NonNullable<
  Awaited<ReturnType<typeof loadHumanFeedback>>
>[number];

export async function Samples({ model }: { model: Model }) {
  const humanFeedback = await loadHumanFeedback(model.id);

  return humanFeedback.length === 0 ? (
    <div className="text-sm text-muted-foreground ml-2">
      No samples have been shared yet
    </div>
  ) : (
    <div>
      {humanFeedback.map((humanFeedback) => (
        <Sample key={humanFeedback.id} humanFeedback={humanFeedback} />
      ))}
    </div>
  );
}

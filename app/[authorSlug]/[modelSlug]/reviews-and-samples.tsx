import { Model } from "@/app/[authorSlug]/[modelSlug]/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import prisma from "@/lib/prisma";
import Reviews from "./reviews";
import { Suspense } from "react";
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

async function Samples({ model }: { model: Model }) {
  const humanFeedback = await loadHumanFeedback(model.id);

  return humanFeedback.length === 0 ? (
    <div className="text-sm text-muted-foreground ml-2">
      No samples have been shared yet
    </div>
  ) : (
    <div>
      {humanFeedback &&
        humanFeedback.map((humanFeedback) => (
          <Sample key={humanFeedback.id} humanFeedback={humanFeedback} />
        ))}
    </div>
  );
}

export default function ReviewsAndSamples({ model }: { model: Model }) {
  return (
    <Tabs defaultValue="reviews" className="mt-10">
      <TabsList className="mb-2">
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="samples">Samples</TabsTrigger>
      </TabsList>
      <TabsContent value="reviews">
        <Reviews model={model} />
      </TabsContent>
      <TabsContent value="samples">
        <Suspense>
          <Samples model={model} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}

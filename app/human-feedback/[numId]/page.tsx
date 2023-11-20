import Sample from "@/app/[authorRemoteId]/[modelRemoteId]/sample";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Return } from "@prisma/client/runtime/library";
import LabelSample from "./label-sample";
import StarRating from "@/components/ui/star-rating";

function loadSample(numId: number) {
  console.log("numId", numId);
  return prisma.humanFeedback.findFirst({
    where: {
      numId: numId,
    },
    include: {
      model: true,
      messages: true,
      tags: true,
    },
  });
}

async function loadSuggestedTags() {
  const first = ["Roleplay", "History", "Science", "Politics", "Philosophy"];
  const popular = await prisma.humanFeedbackTag.findMany({
    where: {
      NOT: {
        name: {
          in: [...first],
        },
      },
    },
    orderBy: {
      humanFeedbacks: {
        _count: "desc",
      },
    },
    take: 100,
  });

  return [...first, ...popular.map((tag) => tag.name)];
}

export type HumanFeedback = NonNullable<Awaited<Return<typeof loadSample>>>;

export default async function Home({ params }: { params: { numId: string } }) {
  const numId = parseInt(params.numId);
  if (!numId) {
    notFound();
  }

  const [humanFeedback, suggestedTags] = await Promise.all([
    loadSample(numId),
    loadSuggestedTags(),
  ]);
  if (!humanFeedback) {
    notFound();
  }

  const { model } = humanFeedback;

  return (
    <div className="mt-6 max-w-xl mb-20 mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-5xl mr-2 font-semibold truncate font-mono">
            Sample #{humanFeedback.numId}
          </h1>
        </div>

        <div className="flex items-center mt-1.5 text-muted-foreground">
          <div className="text-sm">
            {model?.remoteId && (
              <>
                <Link
                  className="hover:underline mr-3"
                  href={`/${model.remoteId}`}
                >
                  {model.name} ({humanFeedback.modelName.replace(".gguf", "")})
                </Link>
              </>
            )}
          </div>
          {humanFeedback.quality && (
            <StarRating rating={humanFeedback.quality} />
          )}
        </div>
      </div>

      <div className="text-xs mb-10">
        Thanks for adding to Otherbrain Open Samples (OOS), a free dataset for
        training open models. It is small, but growing every day with
        contributions like yours. Our hope is to accelerate open model training
        with user-curated training data and accelerate open model adoption with
        interesting samples.
        <br />
        <br />
        <LabelSample
          humanFeedback={humanFeedback}
          suggestedTags={suggestedTags}
        />
      </div>

      <Sample humanFeedback={humanFeedback} hideDate />
    </div>
  );
}

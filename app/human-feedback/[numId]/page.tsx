import Sample from "@/app/[authorRemoteId]/[modelRemoteId]/sample";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Return } from "@prisma/client/runtime/library";
import LabelSample from "./label-sample";
import StarRating from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "@radix-ui/react-icons";

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
  const first = [
    "coding",
    "roleplay",
    "history",
    "science",
    "politics",
    "philosophy",
  ];
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
    <div className="max-w-xl mb-20 mx-auto">
      <div className="text-xs my-10 p-4 bg-green-100">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-end sm:items-center">
          <div className="sm:pr-6 pb-4 sm:pb-0">
            <div className="pb-1 text-xs font-semibold flex items-center space-x-3">
              Sample added ✌️, label it
            </div>
            Otherbrain HF is a free human feedback dataset for training open
            LLMs. It's growing every day with contributions like yours. Our hope
            is to accelerate open model training and adoption. Please label your
            sample to make it more useful.
          </div>
          <LabelSample
            humanFeedback={humanFeedback}
            suggestedTags={suggestedTags}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl mr-2 font-semibold truncate font-mono">
            Sample #{humanFeedback.numId}
          </h1>
        </div>

        <div className="flex items-center mt-1.5 text-muted-foreground mb-1">
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
        {humanFeedback.tags.map((tag) => (
          <Badge key={tag.name} variant="secondary" className="mr-2">
            {tag.name}
          </Badge>
        ))}
        {humanFeedback.nsfw && (
          <Badge variant="secondary" className="mr-1">
            NSFW
          </Badge>
        )}
      </div>

      <Sample humanFeedback={humanFeedback} hideDate />
    </div>
  );
}

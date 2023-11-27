import Chat from "@/app/[authorRemoteId]/[modelRemoteId]/chat";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Return } from "@prisma/client/runtime/library";
import LabelChat from "./label-chat";
import StarRating from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilLineIcon } from "lucide-react";

function loadChat(numId: number) {
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

export type HumanFeedback = NonNullable<Awaited<Return<typeof loadChat>>>;

export default async function Home({ params }: { params: { numId: string } }) {
  const numId = parseInt(params.numId);
  if (!numId) {
    notFound();
  }

  const [humanFeedback, suggestedTags] = await Promise.all([
    loadChat(numId),
    loadSuggestedTags(),
  ]);
  if (!humanFeedback) {
    notFound();
  }

  const { model } = humanFeedback;

  return (
    <div className="max-w-xl mb-20 mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl mr-2 font-semibold truncate font-mono">
          Chat #{humanFeedback.numId},{" "}
          {humanFeedback.createdAt.toLocaleDateString()}
        </h1>

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
        </div>
        <div className="flex items-center space-x-2">
          {humanFeedback.tags.length > 0 && humanFeedback.quality && (
            <StarRating rating={humanFeedback.quality} />
          )}
          {humanFeedback.tags.map((tag) => (
            <Badge key={tag.name} variant="secondary">
              {tag.name}
            </Badge>
          ))}
          {humanFeedback.nsfw && <Badge variant="secondary">NSFW</Badge>}
          <LabelChat
            humanFeedback={humanFeedback}
            suggestedTags={suggestedTags}
          >
            {humanFeedback.tags.length > 0 && humanFeedback.quality ? (
              <Button
                className="text-muted-foreground"
                size="sm"
                variant="ghost"
              >
                Edit
                <PencilLineIcon className="w-3 h-3 ml-1.5" />
              </Button>
            ) : (
              <Button size="sm" className="mt-2">
                Label it
                <PencilLineIcon className="w-3 h-3 ml-1.5" />
              </Button>
            )}
          </LabelChat>
        </div>
      </div>

      <Chat humanFeedback={humanFeedback} hideDate />
    </div>
  );
}

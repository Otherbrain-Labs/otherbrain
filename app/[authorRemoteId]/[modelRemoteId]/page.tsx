import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Scores from "./scores";
import Star from "@/components/ui/star";
import { avgStarsFormatter } from "@/lib/utils";
import { getServerSession } from "@/lib/auth";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import ReviewDialog from "@/components/review-dialog";
import ReviewsAndChats from "./reviews-and-chats";
import { Chats } from "./chats";
import Reviews from "./reviews";

export async function loadModel(modelRemoteId: string, authorRemoteId: string) {
  const model = await prisma.model.findFirst({
    where: {
      remoteId: authorRemoteId + "/" + modelRemoteId,
      author: {
        remoteId: authorRemoteId,
      },
    },
    include: {
      reviews: true,
      author: true,
    },
  });
  model?.reviews.sort(
    (a, b) => b.createdAt?.getTime() || 0 - a.createdAt?.getTime() || 0
  );
  return model;
}

export type Model = NonNullable<Awaited<ReturnType<typeof loadModel>>>;
export type Review = NonNullable<Model["reviews"]>[number];

export default async function Home({
  params,
}: {
  params: { authorRemoteId: string; modelRemoteId: string };
}) {
  const session = await getServerSession();
  const { authorRemoteId, modelRemoteId } = params;
  const model = await loadModel(modelRemoteId, authorRemoteId);

  if (!model || !model.author) {
    notFound();
  }

  const { author } = model;

  const date = new Date(model.lastModifiedDate);
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return (
    <div className="mt-16 max-w-5xl m-auto">
      <div className="sm:flex justify-between items-top border-b pb-5 md:pb-0">
        <div className="mb-3 md:mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-5xl mr-2 font-bold">
              {model.name}
            </h1>
          </div>
          <div className="flex items-center mt-1.5">
            <div className="text-sm text-muted-foreground">
              by{" "}
              <Link
                href={"/" + author.remoteId}
                className="hover:underline mr-3"
              >
                {author.name}
              </Link>
              {dateFormatted}
              <div className="inline-block relative -top-px">
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="ml-3.5 mr-1" variant="secondary">
                      {model.numParameters}B
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Parameter count</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary">{model.arch}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Model type</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {model.avgStars && model.numReviews && (
              <div className="ml-3 inline text-sm">
                <Star
                  className="inline h-3.5 w-3.5 relative -top-px mr-1"
                  filled
                />
                <span>{avgStarsFormatter.format(model.avgStars)}/5</span>
                <span className="ml-3">{model.numReviews} ratings</span>
              </div>
            )}
          </div>
        </div>
        <div className="md:ml-8 md:mt-2 flex space-x-4">
          {model.remoteId && (
            <Button variant="outline" asChild className="hover:bg-transparent">
              <Link
                href={`https://huggingface.co/${model.remoteId}`}
                className="hover:underline"
                rel="noopener noreferrer"
              >
                Model info
                <ExternalLinkIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          {!model.reviews.find(
            (review) => review.userId === session?.user?.id
          ) &&
            (session?.user ? (
              <ReviewDialog model={model}>
                <Button className="hover:underline hover:bg-primary">
                  Write a review
                </Button>
              </ReviewDialog>
            ) : (
              <Button className="hover:underline hover:bg-primary" asChild>
                <Link
                  href={`/login?redirect-to=/${authorRemoteId}/${modelRemoteId}`}
                >
                  Write a review
                </Link>
              </Button>
            ))}
        </div>
      </div>

      {model.average && (
        <div className="mt-10">
          <h2 className="text-xl mb-3">Benchmarks</h2>
          <Scores model={model} />
        </div>
      )}

      {model.ggufId && (
        <div className="max-w-2xl mt-10">
          <h2 className="text-xl">Try this model locally</h2>
          <div className="mt-2 text-sm">
            <ul className="list-disc ml-4">
              <li>
                {" "}
                <Link
                  href={`https://huggingface.co/${model.ggufId}`}
                  className="hover:border-solid border-dotted border-b border-secondary-foreground"
                  rel="noopener noreferrer"
                >
                  Download the GGUF from Hugging Face
                </Link>
                <ExternalLinkIcon className="inline mx-1 h-3 w-3 relative -top-0.5" />{" "}
              </li>
              <li>
                Use the GGUF with a client like{" "}
                <Link
                  href="https://www.freechat.run/"
                  className="hover:border-solid border-dotted border-b border-secondary-foreground"
                  rel="noopener noreferrer"
                >
                  FreeChat
                </Link>
                <ExternalLinkIcon className="inline mx-1 h-3 w-3 relative -top-0.5" />{" "}
                or{" "}
                <Link
                  href="https://lmstudio.ai"
                  className="hover:border-solid border-dotted border-b border-secondary-foreground"
                  rel="noopener noreferrer"
                >
                  LM Studio
                </Link>
                <ExternalLinkIcon className="inline mx-1 h-3 w-3 relative -top-0.5" />
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="max-w-xl mb-20">
        <ReviewsAndChats
          model={model}
          chats={<Chats model={model} />}
          reviews={<Reviews model={model} />}
        />
      </div>
    </div>
  );
}

import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import Review from "./review";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import ReviewDialog from "@/components/review-dialog";

export async function loadModel(modelSlug: string, authorSlug: string) {
  const model = await prisma.model.findFirst({
    where: {
      slug: modelSlug,
      author: {
        slug: authorSlug,
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
  params: { authorSlug: string; modelSlug: string };
}) {
  const session = await getServerSession();

  const model = await loadModel(params.modelSlug, params.authorSlug);

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
    <div className="mt-16 max-w-4xl m-auto">
      <div className="md:flex justify-between items-start">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-5xl mr-2 font-semibold">
              {model.name}
            </h1>
          </div>
          <div className="flex items-center mt-1.5">
            <div className="text-sm">
              by{" "}
              <Link href={"/" + author.slug} className="hover:underline mr-3">
                {author.name}
              </Link>
              {dateFormatted}
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
          <div className="mt-1.5">
            <Tooltip>
              <TooltipTrigger>
                <Badge className="-ml-1 mr-2" variant="secondary">
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
        <div className="mt-4 md:ml-8 md:mt-0 flex space-x-4">
          {model.remoteId && (
            <Button variant="outline" asChild className="hover:bg-white">
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
          ) && (
            <ReviewDialog model={model}>
              <Button className="hover:underline hover:bg-primary">
                Write a review
              </Button>
            </ReviewDialog>
          )}
        </div>
      </div>

      {model.average && (
        <div className="mt-4">
          <h2 className="text-xl mb-3">Benchmarks</h2>
          <Scores model={model} />
        </div>
      )}

      {model.ggufId && (
        <div className="max-w-lg mt-10">
          <h2 className="text-xl">Try it</h2>
          <div className="mt-2">
            To try this model locally,{" "}
            <Link
              href={`https://huggingface.co/${model.ggufId}`}
              className="hover:border-solid border-dotted border-b border-secondary-foreground"
              rel="noopener noreferrer"
            >
              download the GGUF from Hugging Face
            </Link>
            <ExternalLinkIcon className="inline mx-1 h-3 w-3 relative -top-0.5" />{" "}
            and use it with a client like{" "}
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
            .
          </div>
        </div>
      )}

      <div className="max-w-xl mb-20">
        <div className="flex justify-between items-center space-x-3 mt-10 mb-2">
          <h2 className="text-xl">Reviews</h2>
          {!session && (
            <Button variant="outline" asChild>
              <Link href="/login" className="hover:underline">
                Sign in to review
              </Link>
            </Button>
          )}
        </div>

        {model.reviews.length === 0 ? (
          <div>No reviews yet</div>
        ) : (
          model.reviews.map((review) => (
            <Review key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}

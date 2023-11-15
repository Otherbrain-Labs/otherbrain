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
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import ReviewDialog from "@/components/review-dialog";
import ReviewsAndSamples from "@/app/[authorSlug]/[modelSlug]/reviews-and-samples";

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
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  return (
    <div className="mt-16 max-w-2xl m-auto mb-3 md:mb-6">
      {/* <div className="sm:flex justify-between items-center">
        <h1 className="text-3xl md:text-5xl mr-2 font-semibold">
          {model.name}
        </h1>
        <div className="flex">
          {model.remoteId && (
            <Button
              variant="outline"
              asChild
              className="hover:bg-transparent py-6"
            >
              <Link
                href={`https://huggingface.co/${model.remoteId}`}
                className="hover:underline mr-3"
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
              <Button className="hover:underline hover:bg-primary py-6">
                Write a review
              </Button>
            </ReviewDialog>
          )}
        </div>
      </div> */}

      <h1 className="text-3xl md:text-6xl mr-2 font-semibold">{model.name}</h1>
      <div className="mt-4">
        {model.remoteId && (
          <Button
            variant="outline"
            asChild
            className="hover:bg-transparent py-6 px-12"
          >
            <Link
              href={`https://huggingface.co/${model.remoteId}`}
              className="hover:underline mr-3"
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
            <Button className="hover:underline hover:bg-primary py-6 px-12">
              Write a review
            </Button>
          </ReviewDialog>
        )}
      </div>

      <div className="mt-12">
        {model.avgStars && model.numReviews && (
          <div className="text-lg">
            <Star className="inline h-5 w-5 relative -top-0.5 mr-1" filled />
            <span>{avgStarsFormatter.format(model.avgStars)}/5</span>
            <span className="mx-3">{model.numReviews} ratings</span>
            <div className="inline-block relative -top-0.5">
              <Tooltip>
                <TooltipTrigger>
                  <Badge className="mr-1" variant="secondary">
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
        )}
        <div className="text-lg mt-1 leading-snug text-muted-foreground">
          by{" "}
          <Link href={"/" + author.slug} className="hover:underline">
            {author.name}
          </Link>
        </div>
        <div className="text-lg text-muted-foreground italic leading-tight">
          Updated {dateFormatted}
        </div>
      </div>

      {model.average && (
        <div className="mt-10">
          <h2 className="text-xl mb-3">Benchmarks</h2>
          <Scores model={model} />
        </div>
      )}
      {model.ggufId && (
        <div className="mt-10">
          <h2 className="text-xl">Try this model locally</h2>
          <div className="mt-2 leading-relaxed">
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

      <div className="mb-20">
        <ReviewsAndSamples model={model} />
      </div>
    </div>
  );
}

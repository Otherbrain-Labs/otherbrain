import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReviewsForm from "@/components/reviews/form";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, PlusCircle } from "lucide-react";
import Scores from "./scores";
import { headers } from "next/headers";
import StarRating from "@/components/ui/star-rating";
import Star from "@/components/ui/star";
import { avgStarsFormatter } from "@/lib/utils";

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
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return (
    <div className="mt-16 max-w-4xl m-auto">
      <div className="md:flex justify-between items-start">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-4xl font-semibold mr-2">
                {model.name}
              </h1>
              <Tooltip>
                <TooltipTrigger>
                  <Badge className="mr-2" variant="secondary">
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
          <div className="text-muted-foreground">
            by{" "}
            <Link href={"/" + author.slug} className="hover:underline">
              {author.name}
            </Link>
            , {dateFormatted}
          </div>
        </div>
        <div className="mt-4 md:ml-8 md:mt-0 flex space-x-4">
          {model.remoteId && (
            <Button variant="outline" asChild>
              <Link
                href={`https://huggingface.co/${model.remoteId}`}
                className="hover:underline"
                rel="noopener noreferrer"
              >
                Model Details
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Review
          </Button>
        </div>
      </div>

      {model.average && (
        <div className="mt-4">
          <Scores model={model} />
        </div>
      )}

      {model.ggufId && (
        <div className="max-w-lg mt-10">
          <h2 className="text-3xl font-semibold">Try it</h2>
          <div className="mt-4">
            To try this model locally,{" "}
            <Link
              href={`https://huggingface.co/${model.ggufId}`}
              className="hover:underline font-bold"
              rel="noopener noreferrer"
            >
              download a GGUF
            </Link>{" "}
            from Hugging Face and use it with a client like{" "}
            <Link
              href="https://www.freechat.run/"
              className="hover:underline font-bold"
              rel="noopener noreferrer"
            >
              FreeChat
            </Link>{" "}
            (macOS) or{" "}
            <Link
              href="https://lmstudio.ai"
              className="hover:underline font-bold"
              rel="noopener noreferrer"
            >
              LM Studio
            </Link>
            .
          </div>
        </div>
      )}

      <div className="max-w-xl space-y-3 mb-20">
        <div className="flex justify-between items-center space-x-3 mt-10 mb-2">
          <h2 className="text-3xl font-semibold">Reviews</h2>
          <Button variant="outline" asChild>
            <Link href="/login" className="hover:underline">
              Login to review
            </Link>
          </Button>
        </div>
        {model.avgStars && model.numReviews && (
          <div className="flex items-center mb-3 text-2xl">
            <Star className="h-8 w-8" filled />
            <span className="relative left-1 top-0.5">
              {avgStarsFormatter.format(model.avgStars)} average over{" "}
              {model.numReviews} reviews
            </span>
          </div>
        )}
        {session && <ReviewsForm modelId={model.id} />}
        {model.reviews.length === 0 ? (
          <div>No reviews yet</div>
        ) : (
          model.reviews.map((review) => (
            <div key={review.id} className="border p-3">
              <div className="flex justify-between">
                <StarRating rating={review.stars} />
                <div className="text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm mt-1">{review.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReviewsForm from "@/components/reviews/form";
import StarRater from "@/components/ui/star-rater";

export default async function Home({
  params,
}: {
  params: { authorSlug: string; modelSlug: string };
}) {
  const session = await getServerSession();

  const model = await prisma.model.findFirst({
    where: {
      slug: params.modelSlug,
      author: {
        slug: params.authorSlug,
      },
    },
    include: {
      reviews: true,
      author: true,
    },
  });

  if (!model || !model.author) {
    notFound();
  }

  const { author } = model;

  const date = new Date(model.datePublished);
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return (
    <div className="mt-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold mr-2">{model.name}</h1>
            <Tooltip>
              <TooltipTrigger>
                <Badge className="mr-2">{model.numParameters}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Parameter count</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Badge>{model.arch}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Architecture</p>
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

      <h2 className="text-xl font-semibold mt-4 mb-2">Reviews</h2>
      {session && <ReviewsForm modelId={model.id} />}
      {model.reviews.length === 0 ? (
        <div>No reviews yet</div>
      ) : (
        <div className="w-full inline-grid grid-cols-4 gap-3">
          {model.reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded shadow p-3 inline-block hover:bg-accent"
            >
              <span className="text-sm ml-2">{review.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

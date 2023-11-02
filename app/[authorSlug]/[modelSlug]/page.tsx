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

  const date = new Date(model.lastModifiedDate);
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return (
    <div className="mt-16">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-4xl font-semibold mr-2">
              {model.name}
            </h1>
            <Tooltip>
              <TooltipTrigger>
                <Badge className="mr-2">{model.numParameters}B</Badge>
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

      {model.remoteId && (
        <div className="mt-4">
          <Button asChild>
            <Link
              href={`https://huggingface.co/${model.remoteId}`}
              className="hover:underline"
              rel="noopener noreferrer"
            >
              <Image
                height={18}
                width={18}
                alt=""
                src="/huggingface.svg"
                className="mr-2"
              />
              View on Hugging Face
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
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

      {model.average && (
        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Benchmarks</h2>
          {!!model.average && (
            <div>
              <strong>Average:</strong> {model.average}
            </div>
          )}
          {!!model.arc && (
            <div>
              <strong>ARC (25-shot):</strong> {model.arc}
            </div>
          )}
          {!!model.hellaswag && (
            <div>
              <strong>HellaSwag (10-shot):</strong> {model.hellaswag}
            </div>
          )}
          {!!model.mmlu && (
            <div>
              <strong>MMLU (5-shot):</strong> {model.mmlu}
            </div>
          )}
          {!!model.truthfulqa && (
            <div>
              <strong>TruthfulQA (0-shot):</strong> {model.truthfulqa}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center space-x-3 max-w-lg mt-10 mb-2">
        <h2 className="text-3xl font-semibold">Reviews</h2>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add review
        </Button>
      </div>
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

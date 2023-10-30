import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bytesFormat } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default async function Home({
  params,
}: {
  params: { authorSlug: string; modelSlug: string };
}) {
  const author = await prisma.author.findUnique({
    where: {
      slug: params.authorSlug,
    },
  });

  if (!author) {
    notFound();
  }

  const model = await prisma.model.findFirst({
    where: {
      authorId: author.id,
      slug: params.modelSlug,
    },
    include: {
      files: true,
    },
  });

  if (!model) {
    notFound();
  }

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
      <p className="mt-4">{model.description}</p>
    </div>
  );
}

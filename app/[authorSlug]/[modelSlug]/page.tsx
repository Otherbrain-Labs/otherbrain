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
          <div className="justify-self-end">
            <span>Release: {dateFormatted}</span>
          </div>
        </div>
        <div>
          <Link
            href={"/" + author.slug}
            className="hover:underline text-muted-foreground"
          >
            by {author.name}
          </Link>
        </div>
      </div>
      <p className="mt-4">{model.description}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Files</h2>
      <div className="w-full inline-grid grid-cols-4 gap-3">
        {model.files.map((file) => (
          <div
            key={file.id}
            className="border rounded shadow p-3 inline-block hover:bg-accent"
          >
            <span className="text-lg font-semibold">{file.quantization}</span>
            <span className="text-sm ml-2">
              {bytesFormat(Number(file.sizeBytes))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

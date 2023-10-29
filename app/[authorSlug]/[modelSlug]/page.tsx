import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

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
            <span className="mr-2">{model.numParameters}</span>
            <span className="">Architecture: {model.arch}</span>
          </div>
          <div className="justify-self-end">
            <span>Release: {dateFormatted}</span>
          </div>
        </div>
        <div>
          by:{" "}
          <Link
            href={"/" + author.slug}
            className="font-semibold hover:underline"
          >
            {author.name}
          </Link>
        </div>
      </div>
      <p className="mt-4">{model.description}</p>

      <h2 className="text-xl font-semibold mt-4">Files</h2>
      {model.files.map((file) => (
        <div key={file.id}>
          <h3 className="text-lg font-semibold">{file.quantization}</h3>
        </div>
      ))}
    </div>
  );
}

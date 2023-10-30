import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Catalog from "@/components/catalog";

export async function loadModels(authorId: string) {
  const models = await prisma.model.findMany({
    where: {
      authorId: authorId,
    },
    include: {
      author: true,
    },
    orderBy: {
      datePublished: "desc",
    },
  });
  return models;
}

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

  const models = await loadModels(author.id);
  return (
    <div className="mt-6">
      <h1 className="text-2xl font-semibold">{author.name}</h1>
      <p className="mt-2">{author.blurb}</p>

      <h2 className="text-xl font-semibold mt-4">Models</h2>
      <Catalog models={models} />
    </div>
  );
}

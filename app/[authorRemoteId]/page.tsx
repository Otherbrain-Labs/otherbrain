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
      lastModifiedDate: "desc",
    },
  });
  return models;
}

export default async function Home({
  params,
}: {
  params: { authorRemoteId: string };
}) {
  const author = await prisma.author.findUnique({
    where: {
      remoteId: params.authorRemoteId,
    },
  });

  if (!author) {
    notFound();
  }

  const models = await loadModels(author.id);
  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold">{author.name}</h1>

      <h2 className="text-xl font-bold mt-4">Models</h2>
      <Catalog models={models} />
    </div>
  );
}

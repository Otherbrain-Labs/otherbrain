import prisma from "@/lib/prisma";
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
  });

  if (!model) {
    notFound();
  }

  return (
    <div>
      <h1>{JSON.stringify(author)}</h1>
      <h2>{JSON.stringify(model)}</h2>
    </div>
  );
}

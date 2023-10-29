import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function Home({
  params,
}: {
  params: { authorSlug: string; modelSlug: string };
}) {
  const author = await prisma.author.findUnique({
    where: {
      slug: params.authorSlug,
    },
    include: {
      models: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  });

  if (!author) {
    notFound();
  }

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-semibold">{author.name}</h1>
      <p className="mt-2">{author.blurb}</p>

      <h2 className="text-xl font-semibold mt-4">Models</h2>
      {author.models.map((model) => (
        <div key={model.slug}>
          <Link
            href={`/${author.slug}/${model.slug}`}
            className="hover:underline"
          >
            {model.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

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
    <div className="flex h-screen bg-black text-white">
      <div className="w-screen h-screen flex flex-col">
        <div className="text-center max-w-screen-lg mb-10 mt-10 ml-auto mr-auto">
          <h1 className="text-white">{author.name}</h1>

          {author.models.map((model) => (
            <div key={model.slug}>
              <h2>
                <Link href={`/${author.slug}/${model.slug}`}>{model.name}</Link>
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

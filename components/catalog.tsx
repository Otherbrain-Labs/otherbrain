import prisma from "@/lib/prisma";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function Catalog() {
  const models = await prisma.model.findMany({
    include: {
      author: true,
    },
    orderBy: {
      datePublished: "desc",
    },
  });
  return (
    <div className="my-6">
      <Input className="mb-6 max-w-md" placeholder="Search a model name..." />
      <ul className="flex flex-col gap-4">
        {models.map((model) => (
          <li key={model.id}>
            <Link href={`/${model.author.slug}/${model.slug}`}>
              {model.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

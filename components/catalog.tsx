import prisma from "@/lib/prisma";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

async function loadModels() {
  const models = await prisma.model.findMany({
    include: {
      author: true,
    },
    orderBy: {
      datePublished: "desc",
    },
  });
  return models;
}

type CatalogCardProps = {
  model: Awaited<ReturnType<typeof loadModels>>[number];
};

async function CatalogCard({ model }: CatalogCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/${model.author.slug}/${model.slug}`}>{model.name}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="line-clamp-3">
        {model.description && <p className="text-sm">{model.description}</p>}
      </CardContent>
    </Card>
  );
}

export default async function Catalog() {
  const models = await loadModels();
  return (
    <div className="my-6">
      <Input className="mb-6 max-w-md" placeholder="Search a model name..." />
      <ul className="flex flex-col gap-4">
        {models.map((model) => (
          <li key={model.id}>
            <CatalogCard model={model} />
          </li>
        ))}
      </ul>
    </div>
  );
}

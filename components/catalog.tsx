import prisma from "@/lib/prisma";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
  const date = new Date(model.datePublished);
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>
          <Link href={`/${model.author.slug}/${model.slug}`}>{model.name}</Link>
        </CardTitle>
        <CardDescription>{dateFormatted}</CardDescription>
      </CardHeader>
      <CardContent>
        {model.description && (
          <p className="text-sm line-clamp-4">{model.description}</p>
        )}
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

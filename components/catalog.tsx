import Link from "next/link";
import { loadModels } from "@/app/page";
import { loadModels as loadAuthorModels } from "@/app/[authorSlug]/page";
import { Card, CardHeader, CardTitle } from "./ui/card";
import Star from "./ui/star";

type Models =
  | Awaited<ReturnType<typeof loadModels>>
  | Awaited<ReturnType<typeof loadAuthorModels>>;

type CatalogCardProps = {
  model: Models[number];
};

async function CatalogCard({ model }: CatalogCardProps) {
  const date = new Date(model.datePublished);
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const href = `/${model.author.slug}/${model.slug}`;

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>
          <Link href={href}>{model.name}</Link>
        </CardTitle>
        <div className="flex items-center text-xs text-muted-foreground pt-1">
          {dateFormatted}
          <span className="w-1 h-1 mx-1.5 bg-muted-foreground rounded-full"></span>
          <Star filled />
          <p className="font-bold dark:text-white">4.95</p>
          <span className="w-1 h-1 mx-1.5 bg-muted-foreground rounded-full"></span>
          <Link
            href={href}
            className="underline hover:no-underline dark:text-white"
          >
            73 reviews
          </Link>
        </div>
      </CardHeader>
    </Card>
  );
}

export default async function Catalog({ models }: { models: Models }) {
  if (models === null) {
    return null;
  }

  return (
    <div className="my-6">
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

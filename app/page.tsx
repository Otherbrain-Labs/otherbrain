import Image from "next/image";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const models = await prisma.model.findMany({
    include: {
      author: true,
    },
  });

  return (
    <div className="flex h-screen">
      <div className="w-screen h-screen flex flex-col justify-center">
        <h1 className="font-bold text-2xl">Otherbrain</h1>
        <h2>AI model catalog and reviews</h2>
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
    </div>
  );
}

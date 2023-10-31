import prisma from "@/lib/prisma";
import Catalog from "@/components/catalog";

export async function loadModels() {
  const models = await prisma.model.findMany({
    include: {
      author: true,
    },
    orderBy: {
      lastModifiedDate: "desc",
    },
  });
  return models;
}

export default async function Home() {
  const models = await loadModels();

  return (
    <div className="flex h-full">
      <div className="w-screen h-full flex flex-col justify-center">
        <h1 className="font-bold text-5xl">Otherbrain</h1>
        <h2>AI model catalog and reviews</h2>
        <Catalog models={models} />
      </div>
    </div>
  );
}

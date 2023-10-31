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
        <h1 className="text-5xl pt-16 font-semibold">
          Model Catalog & Reviews
        </h1>
        <h2 className="text-1xl text-muted-foreground pt-2 pb-4 max-w-lg">
          Browse reviews and benchmarks of the latest models to find the perfect
          one for your use-case. When LLM's compete, you win.
        </h2>
        <Catalog models={models} />
      </div>
    </div>
  );
}

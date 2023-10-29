import Catalog from "@/components/catalog";

export default async function Home() {
  return (
    <div className="flex h-screen">
      <div className="w-screen h-screen flex flex-col justify-center">
        <h1 className="font-bold text-5xl">Otherbrain</h1>
        <h2>AI model catalog and reviews</h2>
        <Catalog />
      </div>
    </div>
  );
}

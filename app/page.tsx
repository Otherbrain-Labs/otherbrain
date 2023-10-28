import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <Image
          width={512}
          height={512}
          src="/logo.png"
          alt="Platforms on Vercel"
          className="w-48 h-48"
        />
        <div className="text-center max-w-screen-sm mb-10 mt-10">
          <h1 className="text-stone-200 font-bold text-2xl">OTHERBRAIN</h1>
          <h2>AI model catalog and reviews</h2>
        </div>
      </div>
    </div>
  );
}

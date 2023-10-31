"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";

export function MainNav() {
  const pathname = usePathname();
  return (
    <div className="flex flex-row-reverse my-4 justify-between">
      <ModeToggle />
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image
          src="/otherbrain-lockup@2x.png"
          width={Math.floor(238 * 0.75)}
          height={Math.floor(34 * 0.75)}
          alt="Otherbrain"
          className="dark:invert"
        />
      </Link>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";

export function MainNav() {
  const pathname = usePathname();
  return (
    <div className="flex flex-row-reverse my-2 justify-between">
      <ModeToggle />
      {pathname !== "/" && (
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Otherbrain</span>
        </Link>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex my-4 justify-between">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image
          src="/otherbrain-lockup@2x.png"
          width={Math.floor(238 * 0.75)}
          height={Math.floor(34 * 0.75)}
          alt="Otherbrain"
          className="dark:invert"
        />
      </Link>

      <div className="flex">
        {pathname !== "/login" && (
          <Button variant="ghost" asChild className="mr-2">
            <Link href="/login">Sign in</Link>
          </Button>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}

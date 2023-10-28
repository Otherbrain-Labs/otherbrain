"use client";

import * as React from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export function MainNav() {
  return (
    <div className="flex my-2 max-w-5xl mx-auto">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="font-bold">Otherbrain</span>
      </Link>

      <div className="align-self-end">
        <ModeToggle />
      </div>
    </div>
  );
}

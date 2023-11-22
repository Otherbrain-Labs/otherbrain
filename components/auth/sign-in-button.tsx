"use client";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInButton() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <Button variant="ghost" asChild className="mr-2">
      <Link href="/login">Log in</Link>
    </Button>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import AuthNavItem from "@/components/auth/auth-nav-item";
import { Button } from "./ui/button";

export function MainNav() {
  return (
    <div className="flex my-4 justify-between">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image
          src="/otherbrain-lockup@2x.png"
          width={Math.floor(238 * 0.75)}
          height={Math.floor(34 * 0.75)}
          alt="Otherbrain Logo"
          className="dark:invert"
        />
      </Link>

      <div className="flex items-center">
        <Button variant="ghost" asChild className="mr-2">
          <Link href="/human-feedback">HF</Link>
        </Button>
        <AuthNavItem />
        <ModeToggle />
      </div>
    </div>
  );
}

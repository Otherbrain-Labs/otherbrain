import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import AuthNavItem from "@/components/auth/auth-nav-item";
import { Button } from "./ui/button";
import NavItem from "./nav-item";

export function MainNav() {
  return (
    <div className="flex my-4 justify-between">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image
          src="/otherbrain-lockup@2x.png"
          width={Math.floor(238 * 0.75)}
          height={Math.floor(34 * 0.75)}
          alt="Otherbrain Logo"
          className="dark:invert hidden sm:block"
        />
        <Image
          src="/otherbrain-logo-small@2x.png"
          width={41}
          height={32}
          alt="Otherbrain Logo"
          className="dark:invert sm:hidden"
        />
      </Link>

      <div className="flex items-center">
        <NavItem title="Catalog" href="/" />
        <NavItem title="HF" href="/human-feedback" />
        <AuthNavItem />
        <ModeToggle />
      </div>
    </div>
  );
}

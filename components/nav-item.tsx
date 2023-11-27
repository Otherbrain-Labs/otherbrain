"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItemProps = {
  title: string;
  href: string;
};

export default function NavItem({ title, href }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link href={href}>
      <span
        className={cn("mx-2 text-sm px-0.5 font-bold", {
          "bg-accent": active,
        })}
      >
        {title}
      </span>
    </Link>
  );
}

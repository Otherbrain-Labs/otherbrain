"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

import { GitHubLogoIcon, ReloadIcon } from "@radix-ui/react-icons";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [githubLoading, setGithubLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("redirect-to") || "/";

  return (
    <div className="flex flex-col bg-muted space-y-4 px-4 py-8 sm:px-16">
      <Button
        disabled={githubLoading}
        onClick={() => {
          setGithubLoading(true);
          signIn("github", { callbackUrl });
        }}
        className={`${
          githubLoading
            ? "cursor-not-allowed border-border"
            : "border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {githubLoading ? (
          <span className="flex items-center">
            <ReloadIcon className="mr-2 animate-spin" />
            {type === "login" ? "Signing in" : "Creating an account"}
          </span>
        ) : (
          <span className="flex items-center">
            <GitHubLogoIcon className="mr-2" />
            Continue with GitHub
          </span>
        )}
      </Button>

      {type === "login" ? (
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-foreground">
            Sign up
          </Link>{" "}
          for free.
        </p>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-foreground">
            Log in
          </Link>{" "}
          instead.
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import LoadingDots from "@/components/loading-dots";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Form({ type }: { type: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        if (type === "login") {
          signIn("credentials", {
            redirect: false,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
            // @ts-ignore
          }).then(({ error }) => {
            if (error) {
              setLoading(false);
              toast.error(error);
            } else {
              router.refresh();
              router.push("/");
            }
          });
        } else {
          fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: e.currentTarget.email.value,
              password: e.currentTarget.password.value,
            }),
          }).then(async (res) => {
            setLoading(false);
            if (res.status === 200) {
              toast.success("Account created! Redirecting to login...");
              setTimeout(() => {
                router.push("/login");
              }, 2000);
            } else {
              const { error } = await res.json();
              toast.error(error);
            }
          });
        }
      }}
      className="flex flex-col bg-muted space-y-4 px-4 py-8 sm:px-16"
    >
      <div>
        <label
          htmlFor="email"
          className="block text-xs text-muted-foreground uppercase"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="brain@gmail.com"
          autoComplete="email"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-border px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-xs text-muted-foreground uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-border px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
        />
      </div>

      <button
        disabled={loading}
        className={`${
          loading
            ? "cursor-not-allowed border-border "
            : "border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {loading ? (
          <LoadingDots color="#808080" />
        ) : (
          <p>{type === "login" ? "Sign In" : "Sign Up"}</p>
        )}
      </button>

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
            Sign in
          </Link>{" "}
          instead.
        </p>
      )}
    </form>
  );
}

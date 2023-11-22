import Image from "next/image";
import Form from "@/components/auth/auth-form";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-100px)]">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-2 border-b border-border px-4 py-6 pt-8 text-center sm:px-16">
          <Link href="/">
            <Image
              src="/logo.png"
              priority
              alt="Logo"
              className="h-20 w-20 rounded-full dark:invert p-3 border-dashed border"
              width={40}
              height={40}
            />
          </Link>
          <h3 className="text-xl font-semibold">Log In</h3>
          <p className="text-sm text-muted-foreground">Expand your mind</p>
        </div>

        <Form type="login" />
      </div>
    </div>
  );
}

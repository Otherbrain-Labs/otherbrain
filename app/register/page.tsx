import Image from "next/image";
import Form from "@/components/form";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-6 pt-8 text-center sm:px-16">
          <Link href="/">
            <Image
              src="/logo.png"
              priority
              alt="Logo"
              className="h-10 w-10 rounded-full"
              width={20}
              height={20}
            />
          </Link>
          <h3 className="text-xl font-semibold">Sign Up</h3>
          <p className="text-sm text-muted-foreground">
            Create an account with your email and password
          </p>
        </div>
        <Form type="register" />
      </div>
    </div>
  );
}

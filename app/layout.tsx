// These styles apply to every route in the application
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { MainNav } from "@/components/main-nav";
import { Providers } from "./providers";

const title = "Otherbrain";
const description = "AI Model Reviews";

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  metadataBase: new URL("https://www.otherbrain.world"),
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning // next-themes needs this to apply .light/.dark
    >
      <body>
        <Providers>
          <div className="mx-auto px-4 sm:px-8">
            <MainNav />
            <Toaster />
            {children}
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

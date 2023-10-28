// These styles apply to every route in the application
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "Otherbrain";
const description = "AI Model Reviews";

export const metadata: Metadata = {
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
    <html lang="en">
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainNav />
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

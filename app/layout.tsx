// These styles apply to every route in the application
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { GeistSans, GeistMono } from "geist/font";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";
import { TooltipProvider } from "@/components/ui/tooltip";

const title = "Otherbrain";
const description = "AI Model Reviews";

export const revalidate = 60 * 5; // 5 minutes

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
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning // next-themes needs this to apply .light/.dark
    >
      <body>
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="mx-auto px-4 sm:px-8">
              <MainNav />
              <Toaster />
              {children}
            </div>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}

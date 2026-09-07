import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlgoArena | Code Execution Engine",
  description:
    "Manage, compile, and execute algorithmic matrices in real-time.",
  icons: {
    icon: "/image.png", // Standard path fallback
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased selection:bg-violet-500/20 dark:selection:bg-violet-400/30",
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
      )}
      suppressHydrationWarning
    >
      {/* 💡 FIXED: Replaced 'font-sans' with geistSans' variable class directly on the body */}
      <body
        className={cn(
          "min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-zinc-100 antialiased font-normal selection:bg-violet-500/30 selection:text-violet-900 dark:selection:text-violet-200",
          geistSans.className,
        )}
      >
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster
              position="top-right"
              theme="dark"
              className="font-mono text-xs border border-slate-200 dark:border-zinc-800 rounded-xl"
            />
            {/* Flex-grow wrapper ensures footer sticks nicely to the bottom of shorter pages */}
            <main className="flex-1">{children}</main>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

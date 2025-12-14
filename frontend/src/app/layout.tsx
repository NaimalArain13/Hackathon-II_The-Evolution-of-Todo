import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TaskFlow - Organize Your Life, One Task at a Time",
  description:
    "The simple, beautiful way to manage your tasks. Stay organized, boost productivity, and never miss a deadline with TaskFlow.",
  keywords: ["todo app", "task manager", "productivity", "organization", "TaskFlow"],
  openGraph: {
    title: "TaskFlow - Organize Your Life, One Task at a Time",
    description:
      "The simple, beautiful way to manage your tasks. Stay organized, boost productivity, and never miss a deadline.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

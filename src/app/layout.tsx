import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";

import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mochi",
  description: "School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

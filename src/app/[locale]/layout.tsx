// src/app/[locale]/layout.tsx
import type { ReactNode } from "react";
import type { LayoutProps } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Next 15: `params` is a Promise. Layout must match LayoutProps<"/[locale]">.
export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">): Promise<ReactNode> {
  const { locale } = await params; // <- Promise<{ locale: string }>
  // normalize to our supported set, fallback to "sk"
  const lang = locale === "en" || locale === "de" || locale === "sk" ? locale : "sk";

  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}




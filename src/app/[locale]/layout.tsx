// src/app/[locale]/layout.tsx
import type { ReactNode } from "react";
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

// Use a structural type for props that matches what Next expects
type LayoutParams = { locale: string };

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<LayoutParams>;
}): Promise<ReactNode> {
  const { locale } = await params;

  // normalize locale, fallback to "sk"
  const lang =
    locale === "en" || locale === "de" || locale === "sk" ? locale : "sk";

  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}




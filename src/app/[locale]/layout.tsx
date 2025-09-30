// src/app/[locale]/layout.tsx
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

type Params = Promise<{ locale: "sk" | "en" | "de" }>;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}): Promise<ReactNode> {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}




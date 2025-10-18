import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPCS",
  description: "Global Printing & Control Solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Root layout musí byť jediný, ktorý renderuje <html> a <body>.
  // Nechávame neutrálne lang; locale rieši [locale] segment.
  return (
    <html lang="x-default" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}


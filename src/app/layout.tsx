import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPCS",
  description: "Global Printing & Control Solutions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // root layout MUSÍ obsahovať <html> a <body>
  // lang tu nechaj neutrálne – presmerovanie rieši middleware
  return (
    <html lang="x-default">
      <body>{children}</body>
    </html>
  );
}


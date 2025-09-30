import type { ReactNode } from "react";
import type { Locale } from "@/i18n/locales";

export default function LocaleLayout({
  children,
  // params: { locale }, // ak potrebuješ, môžeš si ho nechať v signature
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  // !!! ŽIADNE <html> ani <body> tu !!!
  return <>{children}</>;
}



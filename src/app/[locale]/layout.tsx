// src/app/[locale]/layout.tsx
import type { ReactNode } from "react";

// Povolené jazyky
type Locale = "sk" | "en" | "de";

// Next 15 môže typovať `params` ako Promise<...>, preto spravíme union
type Params = { locale: Locale };
type MaybePromise<T> = T | Promise<T>;

type Props = {
  children: ReactNode;
  params: MaybePromise<Params>;
};

// Layout je server component (bez "use client") a môže byť async
export default async function LocaleLayout({ children, params }: Props) {
  // Znormalizeujeme prípadný Promise v `params`
  const { locale } = await Promise.resolve(params);
  // Lang nastavuj v root layoute (app/layout.tsx); tu len preposielame children
  return <>{children}</>;
}



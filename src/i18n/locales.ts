// src/i18n/locales.ts
export const locales = ["sk", "en", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sk";

/** Type-guard: returns true only for supported locales */
export function isLocale(v?: string | null): v is Locale {
  return typeof v === "string" && (locales as readonly string[]).includes(v);
}

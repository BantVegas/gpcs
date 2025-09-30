// src/i18n/get-dictionary.ts
import type { Locale } from "./locales";

export async function getDictionary(locale: Locale) {
  switch (locale) {
    case "en":
      return (await import("./dictionaries/en.json")).default;
    case "de":
      return (await import("./dictionaries/de.json")).default;
    default:
      return (await import("./dictionaries/sk.json")).default;
  }
}

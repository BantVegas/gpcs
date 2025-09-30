// middleware.ts (v koreňovom priečinku)
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "./src/i18n/locales"; // alebo "@/i18n/locales"

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // static / api veci ignorujeme
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) return;

  // už je s lokalom
  const seg = pathname.split("/")[1];
  if (isLocale(seg)) return;

  // presmeruj na default locale
  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

// ⬅️ dôležité: pridaj aj "/" do matcheru
export const config = {
  matcher: ["/", "/((?!_next|api|.*\\..*).*)"],
};

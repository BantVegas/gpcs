// src/app/[locale]/page.tsx
'use client';

import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Fuel,
  Barcode,
  Camera,
  Wrench,
  Database,
  Bell,
  Sparkles,
  Droplet,
  Palette,
  CalendarDays,
  Menu,
  X,
} from "lucide-react";

import LangSwitcher from "@/components/lang-switcher";

// i18n messages
import sk from "@/i18n/dictionaries/sk.json";
import en from "@/i18n/dictionaries/en.json";
import de from "@/i18n/dictionaries/de.json";

type Locale = "sk" | "en" | "de";
type Messages = typeof sk;
type Feature = { icon: ReactNode; text: string };

// ---- i18n helpers ----
const MESSAGES: Record<Locale, Messages> = { sk, en, de };

function getFromDict(dict: Messages, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (typeof acc === "object" && acc !== null && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict as unknown);
}
// -----------------------------------

// Fallbacky pre prípad, že nové kľúče ešte nie sú v prekladoch
const FALLBACK_DIGI_TITLE = "Digitalizácia – rýchly prehľad";
const FALLBACK_DIGI_SUB = "Kompletné pokrytie od objednávky po doručenie";
const FALLBACK_DIGI_ITEMS = [
  "Klientský portál objednávok (stav, faktúry, reklamácie)",
  "eProof / online schvaľovanie náhľadov s anotáciami",
  "Automatický preflight a opravy PDF + report",
  "APS plánovanie výroby podľa termínov a strojov",
  "MES-lite terminály: štart/stop, odvádzka, checklisty",
  "OEE/TPM dashboardy, dôvody prestojov, trendy",
  "Track & Trace + expedícia, kuriéri, POD archivácia",
  "Sklad materiálu/dielov: FIFO, šarže, inventúry mobilom",
  "Cenotvorba & kalkulácie (šablóny, normy, marža)",
  "IoT zber dát zo strojov, alarmy, senzory",
  "AI predikcie porúch a sklzov, odhad lead-time",
  "RMA/Reklamačný modul s 8D reportom",
  "Integrácie: ERP/MIS, e-shop, účtovníctvo, BI",
  "Archivácia a verzovanie tlačových dát s právami",
];

const FALLBACK_MAINT_ITEMS = [
  "QR karty strojov + história zásahov",
  "Sklad ND prepojený na stroje & zásahy",
  "Checklisty a fotodokumentácia po zásahu",
  "Push/SMS notifikácie (manuálne aj auto)",
  "MTTR/MTBF prehľady a trendy",
];

const FALLBACK_PRINT_TITLE = "Digitalizácia tlačiarní";
const FALLBACK_PRINT_SUB = "Workflow & zákazky pod kontrolou";
const FALLBACK_PRINT_ITEMS = [
  "Príjem a triedenie zákaziek (web/API/e-mail parser)",
  "Generovanie čiarových/QR kódov a štítkov",
  "Tracking výroby s notifikáciami pre klientov",
  "Klientsky portál & schvaľovanie nátlačkov",
];

export default function GpcsLanding({ params }: { params: { locale: Locale } }) {
  const lang: Locale = (params?.locale ?? "sk") as Locale;
  const messages = MESSAGES[lang] ?? MESSAGES.sk;

  // t() teraz podporuje aj fallback
  const t = useCallback((path: string, fallback?: string) => {
    const v = getFromDict(messages, path);
    return typeof v === "string" ? v : (fallback ?? path);
  }, [messages]);

  // tList() – načítanie zoznamu (array) s fallbackom
  const tList = useCallback((path: string, fallback: string[]) => {
    const v = getFromDict(messages, path);
    return Array.isArray(v) ? (v as unknown[]).map(String) : fallback;
  }, [messages]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const prefersReducedMotion = useReducedMotion();
  const closeMenu = useCallback(() => setMobileOpen(false), []);

  const animFast = { duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" as const };

  useEffect(() => {
    const id = setTimeout(() => {}, 8000);
    return () => clearTimeout(id);
  }, []);

  const featuresScan = useMemo<Feature[]>(
    () => [
      { icon: <Camera className="size-5" />, text: t("scan.s1") },
      { icon: <Barcode className="size-5" />, text: t("scan.s2") },
      { icon: <Layers className="size-5" />, text: t("scan.s3") },
      { icon: <Sparkles className="size-5" />, text: t("scan.s4") },
      { icon: <Droplet className="size-5" />, text: t("scan.s5") },
      { icon: <Palette className="size-5" />, text: t("scan.s6") },
    ],
    [t]
  );

  const featuresMaint = useMemo<Feature[]>(
    () => [
      { icon: <Wrench className="size-5" />, text: t("maint.s1") },
      { icon: <CalendarDays className="size-5" />, text: t("maint.s2") },
      { icon: <Sparkles className="size-5" />, text: t("maint.s3") },
      { icon: <Database className="size-5" />, text: t("maint.s4") },
      { icon: <Bell className="size-5" />, text: t("maint.s5") },
      { icon: <ShieldCheck className="size-5" />, text: t("maint.s6") },
    ],
    [t]
  );

  // Digitalizácia – názov, podtitul a položky cez i18n
  const digiTitle = t("digital.quick.title", FALLBACK_DIGI_TITLE);
  const digiSub = t("digital.quick.sub", FALLBACK_DIGI_SUB);
  const digiItems = useMemo<string[]>(
    () => tList("digital.quick.items", FALLBACK_DIGI_ITEMS),
    [tList]
  );

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (res.ok) {
        setStatus("success");
        e.currentTarget.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 6000);
    }
  }

  // výrazne blikajúca položka „Novinka“
  const blinkNav = prefersReducedMotion
    ? undefined
    : { opacity: [1, 0.5, 1], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const } };

  // SILNÉ blikanie motta (vpravo hore)
  const blinkMotto = prefersReducedMotion
    ? undefined
    : {
        opacity: [1, 0.3, 1],
        scale: [1, 1.05, 1],
        transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-svh bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
          <div className="pt-[env(safe-area-inset-top)]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src="/gpcs.png" alt="GPCS logo" width={32} height={32} priority className="rounded-xl ring-1 ring-white/20 object-cover" />
                <span className="text-base sm:text-lg font-semibold tracking-tight">GPCS s.r.o.</span>
                <span className="hidden sm:inline text-sm text-slate-400">— Global Printing & Control Solutions</span>
              </div>

              <div className="flex items-center gap-3">
                <LangSwitcher className="md:hidden" />
                <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
                  <a href="#produkty" className="hover:text-white">{t("nav.products")}</a>
                  <m.a href="#novinka" className="hover:text-white" animate={blinkNav}>{t("nav.news")}</m.a>
                  <a href="#prinosy" className="hover:text-white">{t("nav.benefits")}</a>
                  {/* Cenník -> samostatná stránka */}
                  <a href={`/${lang}/cennik`} className="hover:text-white">{t("nav.pricing")}</a>
                  <a href="#kontakt" className="hover:text-white">{t("nav.contact")}</a>
                  <LangSwitcher className="ml-2" />
                </nav>
                <button
                  type="button"
                  aria-label="Menu"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-menu"
                  className="md:hidden inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 p-2"
                  onClick={() => setMobileOpen((v) => !v)}
                >
                  {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <m.nav
            id="mobile-menu"
            initial={false}
            animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
            transition={animFast}
            className="md:hidden overflow-hidden border-t border-white/10 bg-slate-900/90 backdrop-blur"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
              <div className="grid gap-1">
                <a onClick={closeMenu} href="#produkty" className="block rounded-lg px-3 py-3 hover:bg-white/5">{t("nav.products")}</a>
                <m.a onClick={closeMenu} href="#novinka" className="block rounded-lg px-3 py-3 hover:bg-white/5" animate={blinkNav}>{t("nav.news")}</m.a>
                <a onClick={closeMenu} href="#prinosy" className="block rounded-lg px-3 py-3 hover:bg-white/5">{t("nav.benefits")}</a>
                {/* Cenník -> route */}
                <a onClick={closeMenu} href={`/${lang}/cennik`} className="block rounded-lg px-3 py-3 hover:bg-white/5">{t("nav.pricing")}</a>
                <a onClick={closeMenu} href="#kontakt" className="block rounded-lg px-3 py-3 hover:bg-white/5">{t("nav.contact")}</a>
              </div>
            </div>
          </m.nav>
        </header>

        {/* HERO */}
        <section className="relative overflow-hidden scroll-mt-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(14,165,233,0.25),transparent)]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            {/* TOP TEXT row */}
            <div className="grid items-start gap-3 sm:gap-4 md:grid-cols-2">
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                {t("hero.title")}
              </h1>

              <m.p
                className="text-right text-3xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-200 drop-shadow-[0_0_20px_rgba(59,130,246,0.55)]"
                animate={blinkMotto}
                aria-label={t("hero.motto")}
              >
                {t("hero.motto")}
              </m.p>
            </div>

            {/* supporting lead + digitalizácia text */}
            <div className="mt-4 md:max-w-5xl">
              <p className="text-pretty text-base sm:text-lg text-slate-300">
                {t("hero.lead")}
              </p>
              <p className="mt-3 text-pretty text-base sm:text-lg font-semibold text-slate-100">
                {t("hero.digital")}
              </p>
            </div>

            {/* BOTTOM GRID */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* LEFT: Digitalizácia – karta */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl">
                <div className="rounded-2xl bg-slate-950/60 p-4 sm:p-6">
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{digiTitle}</p>
                      <Fuel className="size-4 text-cyan-400" />
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{digiSub}</p>
                    <ul className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                      {digiItems.map((it) => (
                        <li key={it} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-cyan-400" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* RIGHT: mriežka 2x2 kariet */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl">
                <div className="rounded-2xl bg-slate-950/60 p-4 sm:p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card title="OCR + Barcode" subtitle={t("cards.ocr.sub")} items={[t("cards.ocr.i1"), t("cards.ocr.i2"), t("cards.ocr.i3")]} />
                    <Card title="ΔE & SSIM" subtitle={t("cards.ssim.sub")} items={[t("cards.ssim.i1"), t("cards.ssim.i2"), t("cards.ssim.i3")]} />
                    <Card
                      title={t("cards.maint.title")}
                      subtitle={t("cards.maint.sub")}
                      items={tList("cards.maint.items", FALLBACK_MAINT_ITEMS)}
                    />
                    <Card
                      title={t("cards.print.title", FALLBACK_PRINT_TITLE)}
                      subtitle={t("cards.print.sub", FALLBACK_PRINT_SUB)}
                      items={tList("cards.print.items", FALLBACK_PRINT_ITEMS)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Produkty */}
        <section id="produkty" className="scroll-mt-24 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("products.title")}</h2>
            <p className="mt-2 text-slate-300 max-w-3xl">{t("products.lead")}</p>

            <div className="mt-8 grid gap-10 md:grid-cols-2">
              <div>
                <ProductCard badge="Scancontroll" title={t("products.scan.title")} desc={t("products.scan.desc")} features={featuresScan} />
                <div className="mt-4">
                  <m.a
                    href="https://youtu.be/x982OFN7b1c"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm text-white shadow-[0_0_16px_rgba(34,211,238,0.25)] hover:bg-cyan-400/20 hover:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                    initial={{ opacity: 0.95, scale: 1 }}
                    animate={{ opacity: [1, 0.78, 1], scale: [1, 1.02, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("links.scanVideo")}
                  </m.a>
                </div>
              </div>

              <div>
                <ProductCard badge="MaintControl" title={t("products.maint.title")} desc={t("products.maint.desc")} features={featuresMaint} />
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <m.a
                    href="https://youtu.be/MupquW0d2Gk"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm text-white shadow-[0_0_16px_rgba(34,211,238,0.25)] hover:bg-cyan-400/20 hover:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                    initial={{ opacity: 0.95, scale: 1 }}
                    animate={{ opacity: [1, 0.78, 1], scale: [1, 1.02, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("links.maintMobile")}
                  </m.a>
                  <m.a
                    href="https://youtu.be/SiQ-EJXkXh0"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm text-white shadow-[0_0_16px_rgba(34,211,238,0.25)] hover:bg-cyan-400/20 hover:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                    initial={{ opacity: 0.95, scale: 1 }}
                    animate={{ opacity: [1, 0.78, 1], scale: [1, 1.02, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("links.maintKpi")}
                  </m.a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NOVINKA: KIOSK */}
        <section id="novinka" className="scroll-mt-24 py-12 sm:py-16 border-y border-white/10 bg-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                  {t("nav.news")}
                </span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">{t("news.kiosk.title")}</h2>
                <p className="mt-2 text-slate-300">{t("news.kiosk.p1")}</p>

                <div className="mt-4 space-y-2 text-slate-300">
                  <h3 className="font-semibold text-white">{t("news.kiosk.pgTitle")}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t("news.kiosk.pg1")}</li>
                    <li>{t("news.kiosk.pg2")}</li>
                    <li>{t("news.kiosk.pg3")}</li>
                  </ul>
                  <h3 className="mt-3 font-semibold text-white">{t("news.kiosk.entryTitle")}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t("news.kiosk.en1")}</li>
                    <li>{t("news.kiosk.en2")}</li>
                    <li>{t("news.kiosk.en3")}</li>
                  </ul>
                </div>
              </div>

              <div>
                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/WHG9FbVTPNk"
                    title={t("news.kiosk.title")}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  {t("news.kiosk.ytPrompt")}{" "}
                  <a href="https://youtu.be/WHG9FbVTPNk" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white">
                    {t("news.kiosk.ytOpen")}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRÍNOSY */}
        <section id="prinosy" className="scroll-mt-24 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("benefits.title")}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <Benefit title={t("benefits.b1.t")} text={t("benefits.b1.d")} />
              <Benefit title={t("benefits.b2.t")} text={t("benefits.b2.d")} />
              <Benefit title={t("benefits.b3.t")} text={t("benefits.b3.d")} />
            </div>
          </div>
        </section>

        {/* Demo CTA */}
        <section id="demo" className="scroll-mt-24 py-12 sm:py-16 border-y border-white/10 bg-gradient-to-br from-slate-900 to-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("demo.title")}</h3>
                <p className="mt-2 text-slate-300 max-w-xl">{t("demo.lead")}</p>
                <ul className="mt-4 space-y-2 text-slate-300">
                  {[t("demo.i1"), t("demo.i2"), t("demo.i3")].map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-cyan-400" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
                <form className="grid gap-3" onSubmit={handleContactSubmit}>
                  <input type="text" name="honey" tabIndex={-1} autoComplete="off" className="hidden" />
                  <div>
                    <label className="block text-sm text-slate-300">{t("form.name")}</label>
                    <input name="name" required className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500" placeholder={t("form.namePh")} autoComplete="name" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm text-slate-300">E-mail</label>
                      <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500" placeholder="you@company.com" autoComplete="email" inputMode="email" />
                    </div>
                    <div>
                      <label className="block text sm text-slate-300">{t("form.phone")}</label>
                      <input name="phone" type="tel" className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500" placeholder="+421 9xx xxx xxx" autoComplete="tel" inputMode="tel" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300">{t("form.note")}</label>
                    <textarea name="message" rows={3} required className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500" placeholder={t("form.notePh")} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button type="submit" disabled={status === "loading"} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-950 hover:bg-cyan-400 disabled:opacity-60">
                      {status === "loading" ? t("form.sending") : (<>{t("form.submit")} <ArrowRight className="size-4" /></>)}
                    </button>
                    <a href="mailto:info@gpcs.sk" className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-slate-100 hover:bg-white/5">
                      info@gpcs.sk
                    </a>
                  </div>

                  <p className="mt-2 text-sm" aria-live="polite">
                    {status === "success" && <span className="text-emerald-400">{t("form.ok")}</span>}
                    {status === "error" && <span className="text-rose-400">{t("form.err")}</span>}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="kontakt" className="scroll-mt-24 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="font-semibold">GPCS s.r.o.</p>
                <p className="text-slate-400">Global Printing & Control Solutions</p>
              </div>
              <div className="text-slate-300">
                <p>{t("footer.sec")}</p>
                <p>{t("footer.int")}</p>
                <p>{t("footer.docs")}</p>
              </div>
              <div className="text-slate-300">
                <p>
                  E-mail:{" "}
                  <a className="underline underline-offset-4 hover:text-white" href="mailto:info@gpcs.sk">
                    info@gpcs.sk
                  </a>
                </p>
                <p>Tel: +421 950 889 523</p>
                <p>IČO: 57 150 061</p>
                <p>© {new Date().getFullYear()} GPCS s.r.o.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </LazyMotion>
  );
}

function Card({ title, subtitle, items }: { title: string; subtitle: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="font-medium text-white">{title}</p>
        <Fuel className="size-4 text-cyan-400" />
      </div>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      <ul className="mt-3 space-y-1 text-sm text-slate-300">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-cyan-400" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductCard({
  badge,
  title,
  desc,
  features,
}: {
  badge: string;
  title: string;
  desc: string;
  features: Feature[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 shadow-xl">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
        {badge}
      </span>
      <h3 className="mt-3 text-lg sm:text-xl font-semibold text-white">{title}</h3>
      <p className="mt-1 text-slate-300">{desc}</p>
      <ul className="mt-4 grid gap-2 text-sm text-slate-300">
        {features.map((f) => (
          <li key={f.text} className="flex items-center gap-2">
            <span className="grid place-items-center rounded-lg border border-white/10 bg-slate-900/60 p-1.5 text-cyan-300">
              {f.icon}
            </span>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Benefit({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <h4 className="text-base sm:text-lg font-semibold text-white">{title}</h4>
      <p className="mt-1 text-slate-300">{text}</p>
    </div>
  );
}


























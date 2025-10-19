// src/app/[locale]/cennik/page.tsx
'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

// i18n dictionaries
import sk from '@/i18n/dictionaries/sk.json';
import en from '@/i18n/dictionaries/en.json';
import de from '@/i18n/dictionaries/de.json';

type Locale = 'sk' | 'en' | 'de';
type Messages = typeof sk;

const MESSAGES: Record<Locale, Messages> = { sk, en, de };

// --- i18n helpers ---
function getFromDict(dict: Messages, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (typeof acc === 'object' && acc !== null && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict as unknown);
}
function tString(dict: Messages, path: string, fallback?: string): string {
  const v = getFromDict(dict, path);
  if (typeof v === 'string') return v;
  return typeof fallback === 'string' ? fallback : path;
}
function tArray<T = string>(dict: Messages, path: string, fallback: T[] = []): T[] {
  const v = getFromDict(dict, path);
  return Array.isArray(v) ? (v as T[]) : fallback;
}
// ---------------------

export default function PricingPage({ params }: { params: { locale: Locale } }) {
  const lang = (params?.locale ?? 'sk') as Locale;
  const messages = MESSAGES[lang] ?? MESSAGES.sk;

  const anim = { duration: 0.45, ease: 'easeOut' as const };

  // hero texts
  const title = tString(messages, 'pricing.title', 'Pricing');
  const subtitle = tString(messages, 'pricing.subtitle', '');
  const lead = tString(messages, 'pricing.lead', '');

  // tiers (with safe fallbacks)
  const tiers = [
    {
      key: 'starter',
      name: tString(messages, 'pricing.tiers.starter.name', 'Starter'),
      price: tString(messages, 'pricing.tiers.starter.price', '—'),
      badge: tString(messages, 'pricing.tiers.starter.badge', ''),
      features: tArray<string>(messages, 'pricing.tiers.starter.features', []),
      cta: tString(messages, 'pricing.tiers.starter.cta', ''),
      featured: false,
      featuredLabel: '',
    },
    {
      key: 'pro',
      name: tString(messages, 'pricing.tiers.pro.name', 'Pro'),
      price: tString(messages, 'pricing.tiers.pro.price', '—'),
      badge: tString(messages, 'pricing.tiers.pro.badge', ''),
      features: tArray<string>(messages, 'pricing.tiers.pro.features', []),
      cta: tString(messages, 'pricing.tiers.pro.cta', ''),
      featured: !!tString(messages, 'pricing.tiers.pro.featured', ''),
      featuredLabel: tString(messages, 'pricing.tiers.pro.featured', ''),
    },
    {
      key: 'enterprise',
      name: tString(messages, 'pricing.tiers.enterprise.name', 'Enterprise'),
      price: tString(messages, 'pricing.tiers.enterprise.price', '—'),
      badge: tString(messages, 'pricing.tiers.enterprise.badge', ''),
      features: tArray<string>(messages, 'pricing.tiers.enterprise.features', []),
      cta: tString(messages, 'pricing.tiers.enterprise.cta', ''),
      featured: false,
      featuredLabel: '',
    },
  ];

  // add-ons
  const addonsTitle = tString(messages, 'pricing.addons.title', 'Add-ons');
  const addonsSub = tString(messages, 'pricing.addons.subtitle', '');
  const addons = tArray<string>(messages, 'pricing.addons.items', []);

  // FAQ
  const faq = [
    { q: tString(messages, 'pricing.faq.q1', ''), a: tString(messages, 'pricing.faq.a1', '') },
    { q: tString(messages, 'pricing.faq.q2', ''), a: tString(messages, 'pricing.faq.a2', '') },
    { q: tString(messages, 'pricing.faq.q3', ''), a: tString(messages, 'pricing.faq.a3', '') },
    { q: tString(messages, 'pricing.faq.q4', ''), a: tString(messages, 'pricing.faq.a4', '') },
  ].filter(({ q, a }) => q || a);

  // CTA
  const ctaPrompt = tString(messages, 'pricing.cta.prompt', '');
  const ctaButton = tString(messages, 'pricing.cta.button', '');

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-svh bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        {/* Spacer in case a sticky header is used globally */}
        <div className="pt-[env(safe-area-inset-top)]" />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Hero */}
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={anim}
            className="text-center"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
              <Sparkles className="size-4" /> {title}
            </p>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">
              {subtitle || title}
            </h1>
            {lead && (
              <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
                {lead}
              </p>
            )}
          </m.div>

          {/* Tiers */}
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <m.div
                key={t.key}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={anim}
                className={`rounded-2xl border bg-white/5 p-5 sm:p-6 ${
                  t.featured ? 'border-cyan-400/40 shadow-[0_0_24px_rgba(34,211,238,0.25)]' : 'border-white/10'
                }`}
              >
                {t.featured && t.featuredLabel && (
                  <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                    {t.featuredLabel}
                  </span>
                )}
                <h3 className="text-xl font-semibold text-white">{t.name}</h3>
                {t.badge && <p className="mt-1 text-sm text-slate-400">{t.badge}</p>}
                <p className="mt-4 text-2xl font-bold text-white">{t.price}</p>

                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {t.cta && (
                  <Link
                    href={`/${lang}#demo`}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 hover:bg-cyan-400"
                  >
                    {t.cta} <ArrowRight className="size-4" />
                  </Link>
                )}
              </m.div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <h4 className="text-lg font-semibold text-white">{addonsTitle}</h4>
            {addonsSub && <p className="mt-1 text-sm text-slate-400">{addonsSub}</p>}
            <ul className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
              {addons.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-cyan-400" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          {faq.length > 0 && (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {faq.map((item, i) => (
                <Faq key={i} q={item.q} a={item.a} />
              ))}
            </div>
          )}

          {/* CTA */}
          {(ctaPrompt || ctaButton) && (
            <div className="mt-12 text-center">
              {ctaPrompt && <p className="text-slate-300">{ctaPrompt}</p>}
              {ctaButton && (
                <Link
                  href={`/${lang}#demo`}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-950 hover:bg-cyan-400"
                >
                  {ctaButton} <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </LazyMotion>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  if (!q && !a) return null;
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
    >
      {q && <p className="font-medium text-white">{q}</p>}
      {a && <p className="mt-1 text-slate-300">{a}</p>}
    </m.div>
  );
}


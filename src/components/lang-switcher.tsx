'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale, defaultLocale } from '@/i18n/locales';

// jednoduchý helper na zlučovanie classNames bez závislostí
const cx = (...v: Array<string | false | undefined>) => v.filter(Boolean).join(' ');

function getCurrentLocale(pathname: string): Locale {
  const seg = (pathname.split('/')[1] || defaultLocale) as Locale;
  return (locales as readonly string[]).includes(seg) ? (seg as Locale) : defaultLocale;
}

function switchPath(pathname: string, next: Locale) {
  const parts = pathname.split('/');
  if (parts.length === 1) parts.push(''); // ochrana pri root ceste
  parts[1] = next;
  let p = parts.join('/');
  p = p.replace(/\/{2,}/g, '/');          // zjednoť nadbytočné lomky
  return p || `/${next}`;
}

export default function LangSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const current = getCurrentLocale(pathname);

  // poradie zobrazovania prepínačov
  const order: Locale[] = ['sk', 'en', 'de'];

  return (
    <div className={cx('flex items-center gap-1', className)} aria-label="Language switcher">
      {order
        .filter((l) => (locales as readonly string[]).includes(l))
        .map((l) => {
          const active = l === current;
          return (
            <button
              key={l}
              type="button"
              aria-pressed={active}
              onClick={() => {
                if (active) return;
                document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000`;
                router.push(switchPath(pathname, l));
              }}
              className={cx(
                'uppercase tracking-wide text-[11px] font-semibold rounded-lg px-2 py-1 border transition',
                active
                  ? 'bg-white text-slate-900 border-white'
                  : 'bg-white/5 text-white/90 border-white/20 hover:bg-white/10'
              )}
            >
              {l}
            </button>
          );
        })}
    </div>
  );
}


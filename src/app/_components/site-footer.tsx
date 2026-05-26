"use client";

import Link from "next/link";
import { useLanguage } from "../_i18n/language-provider";

const hrefs = ["/", "/sign-in", "/sign-up", "/", "/"];

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-600">
            SweepLedger
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            {t.footer.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            {t.footer.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
            {t.footer.navigationTitle}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {t.footer.navigation.map((label, index) => (
              <li key={label}>
                <Link href={hrefs[index]} className="transition hover:text-sky-700">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
            {t.footer.productTitle}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {t.footer.notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{t.footer.copyright}</p>
          <p>{t.footer.version}</p>
        </div>
      </div>
    </footer>
  );
}

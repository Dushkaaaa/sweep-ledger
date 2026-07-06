import Link from "next/link";

import { useLanguage } from "../../_i18n/language-provider";
import { LanguageSwitcher } from "../language-switcher";
import { trackerName } from "../employees-section-copy";

const sectionClassName =
  "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8";

export function WorkspaceLoadingState() {
  const { t } = useLanguage();

  return (
    <section className={sectionClassName}>
      <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-medium text-sky-600">{t.common.loading}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {t.home.loadingTitle}
        </h2>
      </div>
    </section>
  );
}

export function WorkspaceGuestState() {
  const { t } = useLanguage();

  return (
    <section className={sectionClassName}>
      <div className="overflow-hidden rounded-[2rem] bg-linear-to-br from-slate-950 via-sky-900 to-cyan-600 p-8 text-white shadow-[0_24px_80px_-32px_rgba(14,116,144,0.65)]">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">
          {trackerName}
        </p>
        <div className="mt-5">
          <LanguageSwitcher variant="dark" />
        </div>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight">
          {t.home.guestTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-cyan-50/90 sm:text-base">
          {t.home.guestDescription}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            {t.home.signIn}
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            {t.home.signUp}
          </Link>
        </div>
      </div>
    </section>
  );
}

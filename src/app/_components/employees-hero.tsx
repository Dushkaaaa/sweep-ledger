"use client";

import { useLanguage } from "../_i18n/language-provider";

type EmployeesHeroProps = {
  companyName: string;
  companyLogoDataUrl: string | null;
  employeesCount: number;
  currentWeekPending: number;
  currentWeekHours: number;
  currentMonthHours: number;
  currentMonthPending: number;
};

export function EmployeesHero({
  companyName,
  companyLogoDataUrl,
  employeesCount,
  currentWeekPending,
  currentWeekHours,
  currentMonthHours,
  currentMonthPending,
}: EmployeesHeroProps) {
  const { t } = useLanguage();

  return (
    <header className="overflow-hidden rounded-[2rem] bg-linear-to-br from-sky-600 via-cyan-500 to-teal-400 p-6 text-white shadow-[0_24px_80px_-32px_rgba(14,116,144,0.65)] sm:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              {companyLogoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={companyLogoDataUrl}
                  alt=""
                  className="h-12 w-12 rounded-xl border border-white/20 bg-white object-contain p-1"
                />
              ) : null}
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">
                {companyName}
              </p>
            </div>
            <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.hero.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-50/90 sm:text-base">
              {t.hero.description}
            </p>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/12 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
              {t.hero.active}
            </p>
            <p className="mt-2 text-3xl font-semibold">{employeesCount}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/75">{t.hero.weekPending}</p>
            <p className="mt-2 text-2xl font-semibold">
              {currentWeekPending} {t.common.currency}
            </p>
          </div>
          <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/75">{t.hero.weekHours}</p>
            <p className="mt-2 text-2xl font-semibold">
              {currentWeekHours} {t.common.hoursShort}
            </p>
          </div>
          <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/75">{t.hero.monthHours}</p>
            <p className="mt-2 text-2xl font-semibold">
              {currentMonthHours} {t.common.hoursShort}
            </p>
          </div>
          <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/75">{t.hero.monthPending}</p>
            <p className="mt-2 text-2xl font-semibold">
              {currentMonthPending} {t.common.currency}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

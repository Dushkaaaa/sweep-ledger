"use client";

import Link from "next/link";
import { useLanguage } from "../_i18n/language-provider";
import { LanguageSwitcher } from "./language-switcher";
import { SiteFooter } from "./site-footer";
import ContactButton from "./contact-form/contact-button";

export function ProductLanding() {
  const { t } = useLanguage();
  const landing = t.landing;

  const featureCards = [
    {
      title: landing.featureTeamTitle,
      description: landing.featureTeamDescription,
    },
    {
      title: landing.featureExecutionTitle,
      description: landing.featureExecutionDescription,
    },
    {
      title: landing.featureAnalyticsTitle,
      description: landing.featureAnalyticsDescription,
    },
    {
      title: landing.featureReportsTitle,
      description: landing.featureReportsDescription,
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,_rgba(34,211,238,0.32)_0%,_rgba(224,247,255,0.82)_32%,_transparent_62%),linear-gradient(135deg,_#ecfeff_0%,_#dff7fb_36%,_#f1f8ff_100%)]">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex justify-end">
          <LanguageSwitcher variant="light" />
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-sky-100/70 bg-white/80 p-8 shadow-[0_24px_80px_-32px_rgba(2,132,199,0.35)] backdrop-blur sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
                {landing.eyebrow}
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {landing.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                {landing.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="rounded-full bg-slate-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
                >
                  {landing.ctaPrimary}
                </Link>
                <a
                  href="#features"
                  className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  {landing.ctaSecondary}
                </a>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-sky-100 bg-slate-950 p-6 text-white shadow-2xl">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-300">
                {landing.panelTitle}
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-lg font-semibold">
                    {landing.panelBenefit1Title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {landing.panelBenefit1Description}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-lg font-semibold">
                    {landing.panelBenefit2Title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {landing.panelBenefit2Description}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-lg font-semibold">
                    {landing.panelBenefit3Title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {landing.panelBenefit3Description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          id="features"
          className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="rounded-[2rem] border border-sky-100 bg-white/80 p-8 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              {landing.audienceEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              {landing.audienceTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {landing.audienceDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {landing.industries.map((industry: string) => (
                <span
                  key={industry}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featureCards.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-[0_24px_80px_-30px_rgba(15,23,42,0.55)] sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                {landing.whyWorkEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                {landing.whyWorkTitle}
              </h2>
            </div>
            <ul className="space-y-3">
              {landing.whyWorkBenefits.map((benefit: string) => (
                <li
                  key={benefit}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm leading-6 text-slate-200"
                >
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-sky-100 bg-white/85 p-8 text-center shadow-sm backdrop-blur sm:p-10">
          <h2 className="text-3xl font-semibold text-slate-900">
            {landing.finalTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {landing.finalDescription}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
              {landing.finalPrimaryCta}
            </Link>
            <ContactButton>{landing.finalSecondaryCta}</ContactButton>
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}

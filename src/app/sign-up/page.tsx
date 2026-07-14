"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "../_components/language-switcher";
import { SiteFooter } from "../_components/site-footer";
import { useLanguage } from "../_i18n/language-provider";
import { supabase } from "@/lib/supabase/client";
import { ensureProfile } from "@/lib/supabase/profiles";

export default function SignUpPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage(t.auth.passwordsMismatch);
      return;
    }

    if (password.length < 8) {
      setErrorMessage(t.auth.passwordTooShort);
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
          phone,
          preferred_language: language,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    if (data.user && data.session) {
      try {
        await ensureProfile(data.user);
        router.push("/");
        router.refresh();
      } catch (profileError) {
        const message =
          profileError instanceof Error
            ? profileError.message
            : t.auth.profileSignUpError;
        setErrorMessage(message);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    setSuccessMessage(t.auth.success);
    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,_rgba(34,211,238,0.34)_0%,_rgba(224,247,255,0.74)_32%,_transparent_62%),linear-gradient(135deg,_#effcff_0%,_#dff7fb_42%,_#eef8ff_100%)]">
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-6 rounded-[2rem] bg-linear-to-br from-slate-950 via-sky-900 to-cyan-600 p-6 text-white shadow-[0_30px_90px_-40px_rgba(2,132,199,0.55)] sm:p-8">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15"
              >
                {t.common.backToTracker}
              </Link>
              <LanguageSwitcher variant="dark" />
            </div>

            <p className="mt-8 text-sm font-medium uppercase tracking-[0.28em] text-cyan-100/70">
              {t.auth.ownerSignUp}
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              {t.auth.signUpTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-cyan-50/90">
              {t.auth.signUpDescription}
            </p>
          </div>

          <div className="grid gap-3">
            {t.auth.benefitsSignUp.map((benefit) => (
              <div
                key={benefit}
                className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
              >
                <p className="text-sm leading-6 text-white/90">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {t.auth.highlightsSignUp.map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                  {label}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.3)] backdrop-blur sm:p-6 lg:p-8">
          <div className="mb-6 flex justify-end">
            <LanguageSwitcher />
          </div>

          <div>
            <p className="text-sm font-medium text-sky-600">
              {t.auth.gettingStarted}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {t.auth.signUpFormTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {t.auth.signUpFormDescription}
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                {t.auth.fullName}
              </span>
              <input
                type="text"
                value={fullName}
                required
                onChange={(event) => setFullName(event.target.value)}
                placeholder={t.auth.fullNamePlaceholder}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                {t.auth.companyName}
              </span>
              <input
                type="text"
                value={companyName}
                required
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder={t.auth.companyPlaceholder}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  {t.common.email}
                </span>
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="team@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  {t.common.phone}
                </span>
                <input
                  type="tel"
                  value={phone}
                  required
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+48 000 000 000"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  {t.common.password}
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t.auth.minPasswordPlaceholder}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  {t.auth.repeatPassword}
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={t.auth.repeatPasswordPlaceholder}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>
            </div>

            {errorMessage ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? t.auth.creating : t.auth.createOwner}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-500">
            {t.auth.hasAccount}{" "}
            <Link
              href="/sign-in"
              className="font-medium text-sky-700 hover:text-sky-800"
            >
              {t.home.signIn}
            </Link>
          </p>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}

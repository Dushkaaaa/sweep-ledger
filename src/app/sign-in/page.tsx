"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteFooter } from "../_components/site-footer";
import { supabase } from "@/lib/supabase/client";
import { ensureProfile } from "@/lib/supabase/profiles";

const benefits = [
  "Швидкий доступ до обліку працівників і виплат",
  "Контроль поточного тижня та архіву без таблиць",
  "Готовий фундамент для майбутнього кабінету",
];

const highlights = [
  { label: "Для кого", value: "Власники та менеджери команд" },
  { label: "Доступ", value: "Один акаунт — одна компанія" },
  { label: "Готовність", value: "Кабінет готовий до роботи" },
];

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    if (data.user) {
      try {
        await ensureProfile(data.user);
      } catch (profileError) {
        const message =
          profileError instanceof Error
            ? profileError.message
            : "Не вдалося підготувати профіль власника.";
        setErrorMessage(message);
        setIsSubmitting(false);
        return;
      }
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#d8efff_0%,_#eef8ff_35%,_#ffffff_100%)]">
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-6 rounded-[2rem] bg-linear-to-br from-slate-950 via-sky-900 to-cyan-600 p-6 text-white shadow-[0_30px_90px_-40px_rgba(2,132,199,0.55)] sm:p-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15"
            >
              ← Назад до трекера
            </Link>

            <p className="mt-8 text-sm font-medium uppercase tracking-[0.28em] text-cyan-100/70">
              Вхід Для Власника
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Увійди в акаунт і продовжуй керувати командою
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-cyan-50/90">
              Увійди у свій кабінет власника, щоб керувати працівниками,
              годинами, авансами та щотижневими підсумками в одному місці.
            </p>
          </div>

          <div className="grid gap-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
              >
                <p className="text-sm leading-6 text-white/90">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.3)] backdrop-blur sm:p-6 lg:p-8">
          <div>
            <p className="text-sm font-medium text-sky-600">Авторизація</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Увійти в кабінет
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Після входу ми одразу перевіряємо профіль власника і переходимо в
              трекер.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="owner@cleanandgo.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Пароль
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Введи пароль"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            {errorMessage ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Входимо..." : "Увійти"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-500">
            Ще не маєш акаунта?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-sky-700 hover:text-sky-800"
            >
              Зареєструватися
            </Link>
          </p>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}

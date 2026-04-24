"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteFooter } from "../_components/site-footer";
import { supabase } from "@/lib/supabase/client";
import { ensureProfile } from "@/lib/supabase/profiles";

const benefits = [
  "Керуй працівниками, ставками та авансами в одному місці",
  "Закривай тиждень і автоматично збирай місячний підсумок",
  "Запускай облік для своєї клінінгової команди без складної CRM",
];

const highlights = [
  { label: "Для кого", value: "Власники клінінгових команд" },
  { label: "Формат", value: "Швидкий інструмент для менеджменту" },
  { label: "Статус", value: "Ранній MVP" },
];

export default function SignUpPage() {
  const router = useRouter();
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
      setErrorMessage("Паролі не співпадають.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Пароль має містити щонайменше 8 символів.");
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
            : "Не вдалося створити профіль власника.";
        setErrorMessage(message);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    setSuccessMessage(
      "Акаунт створено. Перевір пошту та підтвердь email, якщо Supabase просить підтвердження.",
    );
    setIsSubmitting(false);
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
              Реєстрація Власника
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Створи акаунт і керуй командою без хаосу в таблицях
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-cyan-50/90">
              Окрема сторінка для власників вже підключена до Supabase Auth і
              готова стати основою для реального SaaS-кабінету.
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
            <p className="text-sm font-medium text-sky-600">Початок роботи</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Зареєструвати власника
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Після успішної реєстрації власник отримає акаунт у Supabase Auth,
              а профіль компанії збережеться в таблиці `profiles`.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Ім’я та прізвище
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Наприклад Олександр Іванов"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Назва компанії
              </span>
              <input
                type="text"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Наприклад Blue Spark Cleaning"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
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
                  Телефон
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+48 000 000 000"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Пароль
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Мінімум 8 символів"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Повторити пароль
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Повтори пароль"
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
              {isSubmitting ? "Створюємо акаунт..." : "Створити акаунт власника"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-500">
            Уже маєш акаунт?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-sky-700 hover:text-sky-800"
            >
              Увійти
            </Link>
          </p>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}

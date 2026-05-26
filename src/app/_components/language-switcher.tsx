"use client";

import { useLanguage } from "../_i18n/language-provider";
import { languages } from "../_i18n/translations";
import { updateProfileLanguage } from "@/lib/supabase/profiles";

type LanguageSwitcherProps = {
  variant?: "light" | "dark";
};

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();
  const isDark = variant === "dark";

  async function handleLanguageChange(nextLanguage: typeof language) {
    setLanguage(nextLanguage);

    try {
      await updateProfileLanguage(nextLanguage);
    } catch (error) {
      console.warn("Could not save the preferred language.", error);
    }
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-2xl border p-1 ${
        isDark
          ? "border-white/20 bg-white/10 text-white"
          : "border-slate-200 bg-white text-slate-700 shadow-sm"
      }`}
      aria-label={t.common.language}
    >
      <span
        className={`hidden px-2 text-xs font-semibold uppercase tracking-[0.14em] sm:inline ${
          isDark ? "text-white/70" : "text-slate-500"
        }`}
      >
        {t.common.language}
      </span>
      {languages.map((item) => {
        const isActive = item.code === language;

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => handleLanguageChange(item.code)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
              isActive
                ? isDark
                  ? "bg-white text-slate-950"
                  : "bg-slate-950 text-white"
                : isDark
                  ? "text-white/80 hover:bg-white/12 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
            aria-pressed={isActive}
            title={item.label}
          >
            {item.shortLabel}
          </button>
        );
      })}
    </div>
  );
}

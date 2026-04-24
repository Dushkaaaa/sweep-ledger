import Link from "next/link";

const navigation = [
  { label: "Головна", href: "/" },
  { label: "Вхід", href: "/sign-in" },
  { label: "Реєстрація", href: "/sign-up" },
  { label: "Працівники", href: "/" },
  { label: "Місячний підсумок", href: "/" },
];

const productNotes = [
  "Облік годин і ставок",
  "Закриття тижня в один клік",
  "Історія тижнів і місячні підсумки",
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-600">
            SweepLedger
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            Трекер для команди, який справді хочеться відкрити знову
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Простий інструмент для менеджера або власника клінінгової команди:
            години, ставки, аванси, закриття тижня та підсумки за місяць.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
            Навігація
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="transition hover:text-sky-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
            Продукт
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {productNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 text-sm text-slate-500 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 SweepLedger. Зроблено для реального щоденного обліку.</p>
          <p>Версія MVP · Next.js + TypeScript</p>
        </div>
      </div>
    </footer>
  );
}

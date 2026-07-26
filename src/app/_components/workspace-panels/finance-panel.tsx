import { useMemo, useState } from "react";
import type {
  FinanceCategory,
  FinanceEntry,
  NewFinanceEntryInput,
} from "../../_data/finance";
import { getEntriesForMonth, getMonthTotals } from "../../_data/finance";
import type { CabinetCopy } from "../employees-section-copy";
import type { Dictionary } from "../../_i18n/translations";

const categories: FinanceCategory[] = [
  "salary",
  "rent",
  "materials",
  "utilities",
  "transport",
  "taxes",
  "other",
];

function getLocaleForLanguage(language: string) {
  const localeMap: Record<string, string> = {
    uk: "uk-UA",
    en: "en-US",
    de: "de-DE",
    pl: "pl-PL",
  };

  return localeMap[language] ?? "en-US";
}

function getCategoryLabel(copy: CabinetCopy, category: FinanceCategory) {
  const labels: Record<FinanceCategory, string> = {
    salary: copy.financeCategorySalary,
    rent: copy.financeCategoryRent,
    materials: copy.financeCategoryMaterials,
    utilities: copy.financeCategoryUtilities,
    transport: copy.financeCategoryTransport,
    taxes: copy.financeCategoryTaxes,
    other: copy.financeCategoryOther,
  };

  return labels[category];
}

function formatMonthLabel(monthKey: string, locale: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
}

function getCurrentMonthKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `${now.getFullYear()}-${month}`;
}

function shiftMonthKey(monthKey: string, delta: number) {
  const [year, month] = monthKey.split("-").map(Number);

  const totalMonths = year * 12 + (month - 1) + delta;
  const newYear = Math.floor(totalMonths / 12);
  const newMonth = (totalMonths % 12) + 1;

  return `${newYear}-${String(newMonth).padStart(2, "0")}`;
}

export function FinancePanel({
  copy,
  t,
  entries,
  isSaving,
  language,
  onBack,
  onCreateEntry,
  onDeleteEntry,
}: {
  copy: CabinetCopy;
  t: Dictionary;
  entries: FinanceEntry[];
  isSaving: boolean;
  language: string;
  onBack: () => void;
  onCreateEntry: (entry: NewFinanceEntryInput) => void;
  onDeleteEntry: (entryId: string) => void;
}) {
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey());
  const currentMonthKey = getCurrentMonthKey();

  const initialFormState: NewFinanceEntryInput = {
    entryDate: new Date().toISOString().slice(0, 10),
    entryType: "income",
    category: "other",
    amount: 0,
    description: "",
  };

  const [form, setForm] = useState<NewFinanceEntryInput>(initialFormState);

  const monthEntries = useMemo(
    () => getEntriesForMonth(entries, monthKey),
    [entries, monthKey],
  );

  const totals = useMemo(() => getMonthTotals(monthEntries), [monthEntries]);

  const sortedEntries = useMemo(() => {
    return [...monthEntries].sort(
      (left, right) =>
        new Date(right.entryDate).getTime() -
        new Date(left.entryDate).getTime(),
    );
  }, [monthEntries]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.amount <= 0) {
      return;
    }

    onCreateEntry({
      ...form,
      description: form.description.trim(),
    });
    setForm(initialFormState);
  }

  return (
    <section className="rounded-4xl border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {copy.backToMenu}
        </button>
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {copy.financeTitle}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
        {copy.financeDescription}
      </p>

      {/* Місяць navigation */}
      <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <button
          type="button"
          onClick={() => setMonthKey((current) => shiftMonthKey(current, -1))}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← {copy.financePreviousMonth}
        </button>

        <span className="text-sm font-semibold capitalize text-slate-900">
          {formatMonthLabel(monthKey, getLocaleForLanguage(language))}
          {monthKey === currentMonthKey ? ` · ${copy.financeCurrentMonth}` : ""}
        </span>

        <button
          type="button"
          onClick={() => setMonthKey((current) => shiftMonthKey(current, 1))}
          disabled={monthKey >= currentMonthKey}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copy.financeNextMonth} →
        </button>
      </div>

      {/* Totals */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-700">
            {copy.financeIncomeTotal}
          </p>
          <p className="mt-2 text-xl font-semibold text-emerald-800">
            {totals.income.toFixed(2)} {t.common.currency}
          </p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs uppercase tracking-wide text-rose-700">
            {copy.financeExpenseTotal}
          </p>
          <p className="mt-2 text-xl font-semibold text-rose-800">
            {totals.expense.toFixed(2)} {t.common.currency}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {copy.financeBalance}
          </p>
          <p
            className={`mt-2 text-xl font-semibold ${
              totals.balance >= 0 ? "text-slate-900" : "text-rose-700"
            }`}
          >
            {totals.balance.toFixed(2)} {t.common.currency}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Форма додавання */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
        >
          <p className="text-sm font-semibold text-slate-900">
            {copy.financeAddEntry}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>{copy.financeType}</span>
              <select
                value={form.entryType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    entryType: event.target.value as "income" | "expense",
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              >
                <option value="income">{copy.financeTypeIncome}</option>
                <option value="expense">{copy.financeTypeExpense}</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>{copy.financeCategory}</span>
              <select
                value={form.category ?? "other"}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value as FinanceCategory,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryLabel(copy, category)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>{copy.financeAmount}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount || ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    amount: Number(event.target.value),
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>{copy.financeEntryDate}</span>
              <input
                type="date"
                value={form.entryDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    entryDate: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>{copy.financeDescriptionLabel}</span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={2}
              placeholder={copy.financeDescriptionPlaceholder}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={isSaving || form.amount <= 0}
            className="w-full rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {copy.financeSave}
          </button>
        </form>

        {/* Список записів */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-900">
            {copy.financeListTitle}
          </p>

          {sortedEntries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm font-semibold text-slate-900">
                {copy.financeEmptyTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {copy.financeEmptyDescription}
              </p>
            </div>
          ) : (
            sortedEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        entry.entryType === "income"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {entry.entryType === "income"
                        ? copy.financeTypeIncome
                        : copy.financeTypeExpense}
                    </span>
                    {entry.category ? (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {getCategoryLabel(copy, entry.category)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {entry.amount.toFixed(2)} {t.common.currency}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {entry.entryDate}
                    {entry.description ? ` • ${entry.description}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteEntry(entry.id)}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  {copy.financeDelete}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

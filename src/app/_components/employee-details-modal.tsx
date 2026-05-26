"use client";

import { useState } from "react";
import {
  type Employee,
  type WorkDayKey,
  getCurrentMonthSummary,
  getGrossPay,
  getPendingPay,
  getShiftSummary,
  getTotalAdvances,
  getTotalHours,
  getWorkDayLabel,
  workDays,
} from "../_data/employees";
import { useLanguage } from "../_i18n/language-provider";

type EmployeeDetailsModalProps = {
  employee: Employee | null;
  onClose: () => void;
  onDeleteEmployee: (employeeId: string) => void;
  onDayHoursChange: (
    employeeId: string,
    day: WorkDayKey,
    value: number,
  ) => void;
  onAddAdvance: (employeeId: string, day: WorkDayKey, amount: number) => void;
  onRemoveAdvance: (employeeId: string, advanceId: string) => void;
};

export function EmployeeDetailsModal({
  employee,
  onClose,
  onDeleteEmployee,
  onDayHoursChange,
  onAddAdvance,
  onRemoveAdvance,
}: EmployeeDetailsModalProps) {
  const { language, t } = useLanguage();
  const [advanceDay, setAdvanceDay] = useState<WorkDayKey>("monday");
  const [advanceAmount, setAdvanceAmount] = useState("");

  if (!employee) {
    return null;
  }

  const safeEmployee = employee;
  const totalHours = getTotalHours(safeEmployee.workLog);
  const grossPay = getGrossPay(safeEmployee);
  const totalAdvances = getTotalAdvances(safeEmployee.advances);
  const pendingPay = getPendingPay(safeEmployee);
  const monthSummary = getCurrentMonthSummary(safeEmployee, new Date(), language);

  function handleAddAdvance() {
    const amount = Number(advanceAmount);

    if (!amount || amount < 0) {
      return;
    }

    onAddAdvance(safeEmployee.id, advanceDay, amount);
    setAdvanceAmount("");
  }

  function handleDeleteEmployee() {
    const shouldDelete = window.confirm(
      t.details.confirmDelete.replace("{name}", safeEmployee.name),
    );

    if (!shouldDelete) {
      return;
    }

    onDeleteEmployee(safeEmployee.id);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 flex min-h-full items-start justify-center px-4 py-4 sm:items-center sm:px-6 sm:py-6">
        <section className="w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_120px_-40px_rgba(15,23,42,0.55)] sm:max-h-[calc(100dvh-3rem)] sm:overflow-y-auto">
          <div className="bg-linear-to-r from-sky-600 via-cyan-500 to-teal-400 p-5 text-white sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                  {t.details.eyebrow}
                </p>
                <h3 className="mt-2 text-3xl font-semibold">{safeEmployee.name}</h3>
                <p className="mt-2 text-sm text-cyan-50/90">{safeEmployee.role}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-white/25 bg-white/12 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 sm:w-auto"
              >
                {t.common.close}
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <HeroStat label={t.details.rate} value={`${employee.hourlyRate} ${t.common.currency}`} />
              <HeroStat label={t.details.totalHours} value={`${totalHours} ${t.common.hoursShort}`} />
              <HeroStat label={t.details.advances} value={`${totalAdvances} ${t.common.currency}`} />
              <HeroStat label={t.details.pending} value={`${pendingPay} ${t.common.currency}`} />
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <section className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-rose-900">
                    {t.details.dangerTitle}
                  </h4>
                  <p className="mt-1 text-sm text-rose-700">
                    {t.details.dangerDescription}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDeleteEmployee}
                  className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  {t.details.deleteEmployee}
                </button>
              </div>
            </section>

            <section>
              <SectionHeading
                title={t.details.currentWeek}
                description={t.details.currentWeekDescription}
              />

              <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {t.card.gross}{" "}
                <span className="font-semibold text-slate-900">
                  {grossPay} {t.common.currency}
                </span>
                {" · "}
                {getShiftSummary(safeEmployee.workLog, language)}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {workDays.map((day) => (
                  <label
                    key={day.key}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <span className="block text-sm font-medium text-slate-700">
                      {getWorkDayLabel(day.key, language)}
                    </span>
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={safeEmployee.workLog[day.key]}
                        onChange={(event) =>
                          onDayHoursChange(
                            employee.id,
                            day.key,
                            Number(event.target.value) || 0,
                          )
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      />
                      <span className="text-sm font-medium text-slate-500">
                        {t.common.hoursShort}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <SectionHeading
                title={t.details.weeklyAdvances}
                description={t.details.weeklyAdvancesDescription}
              />

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      {t.details.day}
                    </span>
                    <select
                      value={advanceDay}
                      onChange={(event) =>
                        setAdvanceDay(event.target.value as WorkDayKey)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    >
                      {workDays.map((day) => (
                        <option key={day.key} value={day.key}>
                          {getWorkDayLabel(day.key, language)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      {t.details.advanceAmount}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={advanceAmount}
                      onChange={(event) => setAdvanceAmount(event.target.value)}
                      placeholder={t.details.advancePlaceholder}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAddAdvance}
                    className="self-end rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    {t.details.addAdvance}
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {safeEmployee.advances.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500">
                    {t.details.noAdvances}
                  </div>
                ) : (
                  safeEmployee.advances.map((advance) => (
                    <div
                      key={advance.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {getWorkDayLabel(advance.day, language)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {t.details.advanceIssued} {advance.amount}{" "}
                          {t.common.currency}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveAdvance(safeEmployee.id, advance.id)}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        {t.common.delete}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <SectionHeading
                title={t.details.monthSummary}
                description={t.details.monthSummaryDescription}
              />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryStat
                  label={monthSummary.monthLabel}
                  value={`${monthSummary.totalHours} ${t.common.hoursShort}`}
                />
                <SummaryStat
                  label={t.card.gross}
                  value={`${monthSummary.grossPay} ${t.common.currency}`}
                />
                <SummaryStat
                  label={t.details.advances}
                  value={`${monthSummary.advancesTotal} ${t.common.currency}`}
                />
                <SummaryStat
                  label={t.details.pending}
                  value={`${monthSummary.pendingPay} ${t.common.currency}`}
                />
              </div>
            </section>

            <section>
              <SectionHeading
                title={t.details.weekHistory}
                description={t.details.weekHistoryDescription}
              />

              <div className="space-y-3">
                {safeEmployee.weekHistory.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500">
                    {t.details.noClosedWeeks}
                  </div>
                ) : (
                  safeEmployee.weekHistory.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {entry.weekLabel}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {entry.monthLabel} · {entry.closedAt}
                          </p>
                        </div>
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                          {entry.totalHours} {t.common.hoursShort}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <HistoryStat
                          label={t.card.gross}
                          value={`${entry.grossPay} ${t.common.currency}`}
                        />
                        <HistoryStat
                          label={t.details.advances}
                          value={`${entry.advancesTotal} ${t.common.currency}`}
                        />
                        <HistoryStat
                          label={t.details.pending}
                          value={`${entry.pendingPay} ${t.common.currency}`}
                        />
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
      <p className="text-sm text-white/75">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <h4 className="text-xl font-semibold text-slate-900">{title}</h4>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function HistoryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

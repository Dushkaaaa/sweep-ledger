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
  const [advanceDay, setAdvanceDay] = useState<WorkDayKey>("monday");
  const [advanceAmount, setAdvanceAmount] = useState("");

  if (!employee) {
    return null;
  }

  const totalHours = getTotalHours(employee.workLog);
  const grossPay = getGrossPay(employee);
  const totalAdvances = getTotalAdvances(employee.advances);
  const pendingPay = getPendingPay(employee);
  const monthSummary = getCurrentMonthSummary(employee);

  function handleAddAdvance() {
    const amount = Number(advanceAmount);

    if (!amount || amount < 0) {
      return;
    }

    if (!employee) return; /// Add safety check for employee existence

    onAddAdvance(employee.id, advanceDay, amount);
    setAdvanceAmount("");
  }

  function handleDeleteEmployee() {
    if (!employee) return; /// Add safety check for employee existence
    const shouldDelete = window.confirm(
      `Видалити працівника ${employee.name}? Цю дію не можна скасувати.`,
    );

    if (!shouldDelete) {
      return;
    }

    onDeleteEmployee(employee.id);
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
                  Деталі працівника
                </p>
                <h3 className="mt-2 text-3xl font-semibold">{employee.name}</h3>
                <p className="mt-2 text-sm text-cyan-50/90">{employee.role}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-white/25 bg-white/12 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 sm:w-auto"
              >
                Закрити
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
                <p className="text-sm text-white/75">Ставка</p>
                <p className="mt-2 text-2xl font-semibold">
                  {employee.hourlyRate} PLN
                </p>
              </div>
              <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
                <p className="text-sm text-white/75">Усього годин</p>
                <p className="mt-2 text-2xl font-semibold">{totalHours} год</p>
              </div>
              <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
                <p className="text-sm text-white/75">Аванси</p>
                <p className="mt-2 text-2xl font-semibold">
                  {totalAdvances} PLN
                </p>
              </div>
              <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
                <p className="text-sm text-white/75">До виплати</p>
                <p className="mt-2 text-2xl font-semibold">{pendingPay} PLN</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <section className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-rose-900">
                    Небезпечна дія
                  </h4>
                  <p className="mt-1 text-sm text-rose-700">
                    Якщо працівник більше не потрібен, його можна видалити зі
                    списку разом з поточними даними та історією.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDeleteEmployee}
                  className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Видалити працівника
                </button>
              </div>
            </section>

            <section>
              <div className="mb-5">
                <h4 className="text-xl font-semibold text-slate-900">
                  Поточний тиждень
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Години по днях автоматично сумуються, а суми перераховуються
                  одразу.
                </p>
              </div>

              <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Нараховано{" "}
                <span className="font-semibold text-slate-900">
                  {grossPay} PLN
                </span>
                {" · "}
                {getShiftSummary(employee.workLog)}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {workDays.map((day) => (
                  <label
                    key={day.key}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <span className="block text-sm font-medium text-slate-700">
                      {day.label}
                    </span>
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={employee.workLog[day.key]}
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
                        год
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-5">
                <h4 className="text-xl font-semibold text-slate-900">
                  Аванси протягом тижня
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Додай день і суму. Аванс автоматично відніметься від виплати.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      День
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
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Сума авансу
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={advanceAmount}
                      onChange={(event) => setAdvanceAmount(event.target.value)}
                      placeholder="Наприклад 200"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAddAdvance}
                    className="self-end rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Додати аванс
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {employee.advances.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500">
                    Ще немає жодного авансу.
                  </div>
                ) : (
                  employee.advances.map((advance) => (
                    <div
                      key={advance.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {getWorkDayLabel(advance.day)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Видано авансом {advance.amount} PLN
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveAdvance(employee.id, advance.id)}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        Видалити
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <div className="mb-5">
                <h4 className="text-xl font-semibold text-slate-900">
                  Підсумок за місяць
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  У місячний підсумок входять усі закриті тижні цього місяця та
                  поточний відкритий тиждень.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{monthSummary.monthLabel}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {monthSummary.totalHours} год
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Нараховано</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {monthSummary.grossPay} PLN
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Аванси</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {monthSummary.advancesTotal} PLN
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">До виплати</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {monthSummary.pendingPay} PLN
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-5">
                <h4 className="text-xl font-semibold text-slate-900">
                  Історія тижнів
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Після закриття тижня години та підсумки потрапляють сюди, а
                  поточний тиждень обнуляється.
                </p>
              </div>

              <div className="space-y-3">
                {employee.weekHistory.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500">
                    Ще немає жодного закритого тижня.
                  </div>
                ) : (
                  employee.weekHistory.map((entry) => (
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
                          {entry.totalHours} год
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Нараховано
                          </p>
                          <p className="mt-2 font-semibold text-slate-900">
                            {entry.grossPay} PLN
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Аванси
                          </p>
                          <p className="mt-2 font-semibold text-slate-900">
                            {entry.advancesTotal} PLN
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            До виплати
                          </p>
                          <p className="mt-2 font-semibold text-slate-900">
                            {entry.pendingPay} PLN
                          </p>
                        </div>
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

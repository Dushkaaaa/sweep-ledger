"use client";

import { useState } from "react";
import type { NewEmployeeInput } from "../_data/employees";

type NewEmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: NewEmployeeInput) => void;
};

export function NewEmployeeModal({
  isOpen,
  onClose,
  onSubmit,
}: NewEmployeeModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  if (!isOpen) {
    return null;
  }

  function resetForm() {
    setName("");
    setRole("");
    setHourlyRate("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit() {
    const normalizedName = name.trim();
    const normalizedRole = role.trim();
    const normalizedRate = Number(hourlyRate);

    if (!normalizedName || !normalizedRole || normalizedRate <= 0) {
      return;
    }

    onSubmit({
      name: normalizedName,
      role: normalizedRole,
      hourlyRate: normalizedRate,
    });
    resetForm();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={handleClose} aria-hidden="true" />

      <div className="relative z-10 flex min-h-full items-start justify-center px-4 py-4 sm:items-center sm:px-6 sm:py-6">
        <section className="w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_120px_-40px_rgba(15,23,42,0.55)]">
          <div className="bg-linear-to-r from-slate-950 via-slate-900 to-sky-800 p-5 text-white sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/65">
                  Новий працівник
                </p>
                <h3 className="mt-2 text-3xl font-semibold">
                  Додати до команди
                </h3>
                <p className="mt-2 text-sm text-slate-200/85">
                  Створимо нову картку зі ставкою, а години й аванси додаси
                  пізніше.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/16 sm:w-auto"
              >
                Закрити
              </button>
            </div>
          </div>

          <div className="space-y-4 p-5 sm:p-6">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Ім’я працівника
              </span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Наприклад Марія"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Посада або тип роботи
              </span>
              <input
                type="text"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Наприклад Генеральне прибирання"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Ставка за годину
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={hourlyRate}
                  onChange={(event) => setHourlyRate(event.target.value)}
                  placeholder="Наприклад 35"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
                <span className="text-sm font-medium text-slate-500">PLN/год</span>
              </div>
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Створити працівника
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

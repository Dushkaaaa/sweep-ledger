"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import {
  type Employee,
  type NewEmployeeInput,
  type WorkDayKey,
  getCurrentMonthSummary,
  getPendingPay,
  getTotalHours,
  hasCurrentWeekActivity,
} from "../_data/employees";
import { supabase } from "@/lib/supabase/client";
import { fetchProfile } from "@/lib/supabase/profiles";
import {
  addEmployeeAdvance,
  closeEmployeeWeek,
  createEmployeeForOwner,
  deleteEmployeeById,
  fetchEmployeesForOwner,
  getErrorMessage,
  removeEmployeeAdvance,
  signOutOwner,
  updateEmployeeDayHours,
} from "@/lib/supabase/tracker";
import { EmployeeCard } from "./employee-card";
import { EmployeeDetailsModal } from "./employee-details-modal";
import { EmployeesHero } from "./employees-hero";
import { NewEmployeeModal } from "./new-employee-modal";

const trackerName = "SweepLedger";

export function EmployeesSection() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [companyName, setCompanyName] = useState(trackerName);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentWeekPending = employees.reduce(
    (total, employee) => total + getPendingPay(employee),
    0,
  );
  const currentWeekHours = employees.reduce(
    (total, employee) => total + getTotalHours(employee.workLog),
    0,
  );
  const currentMonthSummary = employees.reduce(
    (summary, employee) => {
      const employeeSummary = getCurrentMonthSummary(employee);

      return {
        totalHours: summary.totalHours + employeeSummary.totalHours,
        pendingPay: summary.pendingPay + employeeSummary.pendingPay,
      };
    },
    {
      totalHours: 0,
      pendingPay: 0,
    },
  );

  const selectedEmployee =
    employees.find((employee) => employee.id === selectedEmployeeId) ?? null;

  async function reloadWorkspace(ownerId: string, fallbackCompanyName?: string) {
    setErrorMessage("");

    const [profile, employeeList] = await Promise.all([
      fetchProfile(ownerId),
      fetchEmployeesForOwner(ownerId),
    ]);

    setCompanyName(
      profile?.company_name ??
        fallbackCompanyName ??
        (typeof session?.user.user_metadata.company_name === "string"
          ? session.user.user_metadata.company_name
          : trackerName),
    );
    setEmployees(employeeList);
  }

  useEffect(() => {
    let active = true;

    async function initialize() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      setSession(currentSession);

      if (!currentSession?.user) {
        setEmployees([]);
        setCompanyName(trackerName);
        setIsLoading(false);
        return;
      }

      try {
        const fallbackCompanyName =
          typeof currentSession.user.user_metadata.company_name === "string"
            ? currentSession.user.user_metadata.company_name
            : trackerName;
        const [profile, employeeList] = await Promise.all([
          fetchProfile(currentSession.user.id),
          fetchEmployeesForOwner(currentSession.user.id),
        ]);

        setCompanyName(
          profile?.company_name ?? fallbackCompanyName ?? trackerName,
        );
        setEmployees(employeeList);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (!nextSession?.user) {
        setEmployees([]);
        setSelectedEmployeeId(null);
        setCompanyName(trackerName);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const fallbackCompanyName =
        typeof nextSession.user.user_metadata.company_name === "string"
          ? nextSession.user.user_metadata.company_name
          : trackerName;

      void Promise.all([
        fetchProfile(nextSession.user.id),
        fetchEmployeesForOwner(nextSession.user.id),
      ])
        .then(([profile, employeeList]) => {
          setCompanyName(
            profile?.company_name ?? fallbackCompanyName ?? trackerName,
          );
          setEmployees(employeeList);
        })
        .catch((error) => {
          setErrorMessage(getErrorMessage(error));
        })
        .finally(() => {
          setIsLoading(false);
        });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  function handleCardClick(employeeId: string) {
    setSelectedEmployeeId(employeeId);
  }

  function handleCloseModal() {
    setSelectedEmployeeId(null);
  }

  async function handleDeleteEmployee(employeeId: string) {
    if (!session?.user) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await deleteEmployeeById(employeeId);
      await reloadWorkspace(session.user.id);
      setSelectedEmployeeId(null);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  function handleOpenCreateEmployee() {
    setIsCreatingEmployee(true);
  }

  function handleCloseCreateEmployee() {
    setIsCreatingEmployee(false);
  }

  async function handleCreateEmployee(employee: NewEmployeeInput) {
    if (!session?.user) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await createEmployeeForOwner(session.user.id, employee);
      await reloadWorkspace(session.user.id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCloseWeek() {
    if (!session?.user) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await Promise.all(
        employees
          .filter((employee) => hasCurrentWeekActivity(employee))
          .map((employee) => closeEmployeeWeek(employee)),
      );
      await reloadWorkspace(session.user.id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDayHoursChange(
    employeeId: string,
    day: WorkDayKey,
    value: number,
  ) {
    if (!session?.user) {
      return;
    }

    const employee = employees.find((item) => item.id === employeeId);

    if (!employee?.currentWeekId) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await updateEmployeeDayHours(employee.currentWeekId, day, Math.max(0, value));
      await reloadWorkspace(session.user.id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddAdvance(
    employeeId: string,
    day: WorkDayKey,
    amount: number,
  ) {
    if (!session?.user) {
      return;
    }

    const employee = employees.find((item) => item.id === employeeId);

    if (!employee?.currentWeekId) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await addEmployeeAdvance(employee.currentWeekId, day, amount);
      await reloadWorkspace(session.user.id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemoveAdvance(_employeeId: string, advanceId: string) {
    if (!session?.user) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await removeEmployeeAdvance(advanceId);
      await reloadWorkspace(session.user.id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    setIsSaving(true);
    setErrorMessage("");

    try {
      await signOutOwner();
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
          <p className="text-sm font-medium text-sky-600">Завантаження</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Підтягуємо дані команди з Supabase
          </h2>
        </div>
      </section>
    );
  }

  if (!session?.user) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-linear-to-br from-slate-950 via-sky-900 to-cyan-600 p-8 text-white shadow-[0_24px_80px_-32px_rgba(14,116,144,0.65)]">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">
            {trackerName}
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight">
            Увійди як власник, щоб працювати з реальною базою даних
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-cyan-50/90 sm:text-base">
            Тепер трекер підключений до Supabase, тому для роботи з працівниками,
            тижнями й авансами потрібен акаунт власника.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Увійти
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Створити акаунт
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <EmployeesHero
          companyName={companyName}
          employeesCount={employees.length}
          currentWeekPending={currentWeekPending}
          currentWeekHours={currentWeekHours}
          currentMonthHours={currentMonthSummary.totalHours}
          currentMonthPending={currentMonthSummary.pendingPay}
        />

        <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-medium text-sky-600">Працівники</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Список команди
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Дані вже беруться із Supabase. Закрий тиждень, щоб перенести
                години в історію та почати новий цикл.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Вийти
              </button>
              <button
                type="button"
                onClick={handleCloseWeek}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Закрити тиждень
              </button>
              <button
                type="button"
                onClick={handleOpenCreateEmployee}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                + Додати нового працівника
              </button>
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          {employees.length === 0 ? (
            <div className="mt-5 rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm font-medium text-sky-600">Порожньо</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                У тебе ще немає жодного працівника
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Додай першого працівника і дані одразу збережуться в базі.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {employees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onClick={() => handleCardClick(employee.id)}
                />
              ))}
            </div>
          )}
        </section>
      </section>

      <EmployeeDetailsModal
        employee={selectedEmployee}
        onClose={handleCloseModal}
        onDeleteEmployee={handleDeleteEmployee}
        onDayHoursChange={handleDayHoursChange}
        onAddAdvance={handleAddAdvance}
        onRemoveAdvance={handleRemoveAdvance}
      />

      <NewEmployeeModal
        isOpen={isCreatingEmployee}
        onClose={handleCloseCreateEmployee}
        onSubmit={handleCreateEmployee}
      />
    </>
  );
}

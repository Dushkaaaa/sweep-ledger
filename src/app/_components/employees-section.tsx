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
  getMonthKey,
  getPendingPay,
  getTotalHours,
  getWorkDayLabel,
  hasCurrentWeekActivity,
  workDays,
} from "../_data/employees";
import { isLanguageCode, useLanguage } from "../_i18n/language-provider";
import type { LanguageCode } from "../_i18n/translations";
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
import { LanguageSwitcher } from "./language-switcher";
import { NewEmployeeModal } from "./new-employee-modal";

const trackerName = "SweepLedger";

type CabinetSection =
  | "home"
  | "employees"
  | "weekly-report"
  | "monthly-report"
  | "settings";

const cabinetCopy = {
  uk: {
    title: "Кабінет керування",
    description:
      "Обери розділ, з яким хочеш працювати зараз. Працівники, звіти й налаштування тепер розділені по окремих плитках.",
    backToMenu: "Назад до меню",
    menu: {
      home: "Головна",
      employees: "Працівники",
      weeklyReport: "Звіт за тиждень",
      monthlyReport: "Звіт за місяць",
      settings: "Налаштування",
      signOut: "Вихід з кабінету",
    },
    hints: {
      home: "Огляд кабінету",
      employees: "Список і картки команди",
      weeklyReport: "Години та виплати за тиждень",
      monthlyReport: "Зведення за поточний місяць",
      settings: "Мова та параметри кабінету",
      signOut: "Завершити сесію",
    },
    weeklyTitle: "Звіт за тиждень",
    monthlyTitle: "Звіт за місяць",
    settingsTitle: "Налаштування",
    weeklyDescription:
      "Коротке зведення по відкритому тижню. Детальні звіти можна розширити пізніше окремими таблицями.",
    monthlyDescription:
      "Поточний місячний підсумок по всіх працівниках з урахуванням закритих тижнів.",
    settingsDescription:
      "Базові налаштування кабінету. Зараз тут доступний вибір мови інтерфейсу.",
    employeesCount: "Працівників",
    activeWeekHours: "Годин за тиждень",
    pendingWeekPay: "До виплати за тиждень",
    activeMonthHours: "Годин за місяць",
    pendingMonthPay: "До виплати за місяць",
    downloadMonthlyPdf: "Завантажити PDF",
  },
  en: {
    title: "Workspace menu",
    description:
      "Choose the section you want to work with now. Employees, reports, and settings are split into separate tiles.",
    backToMenu: "Back to menu",
    menu: {
      home: "Home",
      employees: "Employees",
      weeklyReport: "Weekly report",
      monthlyReport: "Monthly report",
      settings: "Settings",
      signOut: "Sign out",
    },
    hints: {
      home: "Workspace overview",
      employees: "Team list and employee cards",
      weeklyReport: "Weekly hours and payouts",
      monthlyReport: "Current month summary",
      settings: "Language and workspace options",
      signOut: "End the session",
    },
    weeklyTitle: "Weekly report",
    monthlyTitle: "Monthly report",
    settingsTitle: "Settings",
    weeklyDescription:
      "A quick summary of the open week. Detailed report tables can be expanded later.",
    monthlyDescription:
      "Current monthly totals across all employees, including closed weeks.",
    settingsDescription:
      "Basic workspace settings. For now, language selection is available here.",
    employeesCount: "Employees",
    activeWeekHours: "Hours this week",
    pendingWeekPay: "Pending this week",
    activeMonthHours: "Hours this month",
    pendingMonthPay: "Pending this month",
    downloadMonthlyPdf: "Download PDF",
  },
  pl: {
    title: "Menu panelu",
    description:
      "Wybierz sekcję, z którą chcesz teraz pracować. Pracownicy, raporty i ustawienia są rozdzielone na osobne kafelki.",
    backToMenu: "Wróć do menu",
    menu: {
      home: "Główna",
      employees: "Pracownicy",
      weeklyReport: "Raport tygodniowy",
      monthlyReport: "Raport miesięczny",
      settings: "Ustawienia",
      signOut: "Wyjście z panelu",
    },
    hints: {
      home: "Przegląd panelu",
      employees: "Lista i karty zespołu",
      weeklyReport: "Godziny i wypłaty za tydzień",
      monthlyReport: "Podsumowanie bieżącego miesiąca",
      settings: "Język i opcje panelu",
      signOut: "Zakończ sesję",
    },
    weeklyTitle: "Raport tygodniowy",
    monthlyTitle: "Raport miesięczny",
    settingsTitle: "Ustawienia",
    weeklyDescription:
      "Krótkie podsumowanie otwartego tygodnia. Szczegółowe tabele raportów można rozbudować później.",
    monthlyDescription:
      "Bieżące miesięczne podsumowanie wszystkich pracowników z uwzględnieniem zamkniętych tygodni.",
    settingsDescription:
      "Podstawowe ustawienia panelu. Na razie dostępny jest wybór języka interfejsu.",
    employeesCount: "Pracowników",
    activeWeekHours: "Godzin w tygodniu",
    pendingWeekPay: "Do wypłaty za tydzień",
    activeMonthHours: "Godzin w miesiącu",
    pendingMonthPay: "Do wypłaty za miesiąc",
    downloadMonthlyPdf: "Pobierz PDF",
  },
} as const;

export function EmployeesSection() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const copy = cabinetCopy[language];
  const [activeSection, setActiveSection] = useState<CabinetSection>("home");
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
      const employeeSummary = getCurrentMonthSummary(employee, new Date(), language);

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

  async function reloadWorkspace(
    ownerId: string,
    fallbackCompanyName?: string,
  ) {
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
    const profileLanguage = profile?.preferred_language ?? null;

    if (isLanguageCode(profileLanguage)) {
      setLanguage(profileLanguage);
    }
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
        const profileLanguage = profile?.preferred_language ?? null;

        if (isLanguageCode(profileLanguage)) {
          setLanguage(profileLanguage);
        }
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
          const profileLanguage = profile?.preferred_language ?? null;

          if (isLanguageCode(profileLanguage)) {
            setLanguage(profileLanguage);
          }
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
  }, [setLanguage]);

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
      await updateEmployeeDayHours(
        employee.currentWeekId,
        day,
        Math.max(0, value),
      );
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

  async function handleDownloadMonthlyReport() {
    await downloadMonthlyReportPdf({
      companyName,
      employees,
      language,
      currency: t.common.currency,
      hoursLabel: t.common.hoursShort,
    });
  }

  const summaryStats = {
    employeesCount: employees.length,
    currentWeekPending,
    currentWeekHours,
    currentMonthHours: currentMonthSummary.totalHours,
    currentMonthPending: currentMonthSummary.pendingPay,
  };

  if (isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
          <p className="text-sm font-medium text-sky-600">{t.common.loading}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {t.home.loadingTitle}
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
          <div className="mt-5">
            <LanguageSwitcher variant="dark" />
          </div>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight">
            {t.home.guestTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-cyan-50/90 sm:text-base">
            {t.home.guestDescription}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              {t.home.signIn}
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              {t.home.signUp}
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

        {activeSection === "home" ? (
          <CabinetMenu
            copy={copy}
            isSaving={isSaving}
            stats={summaryStats}
            onNavigate={setActiveSection}
            onSignOut={handleSignOut}
          />
        ) : null}

        {activeSection === "employees" ? (
          <EmployeesPanel
            t={t}
            copy={copy}
            employees={employees}
            errorMessage={errorMessage}
            isSaving={isSaving}
            onBack={() => setActiveSection("home")}
            onCloseWeek={handleCloseWeek}
            onCreateEmployee={() => setIsCreatingEmployee(true)}
            onSelectEmployee={setSelectedEmployeeId}
          />
        ) : null}

        {activeSection === "weekly-report" ? (
          <ReportPanel
            title={copy.weeklyTitle}
            description={copy.weeklyDescription}
            copy={copy}
            stats={[
              [copy.employeesCount, String(summaryStats.employeesCount)],
              [
                copy.activeWeekHours,
                `${summaryStats.currentWeekHours} ${t.common.hoursShort}`,
              ],
              [
                copy.pendingWeekPay,
                `${summaryStats.currentWeekPending} ${t.common.currency}`,
              ],
            ]}
            onBack={() => setActiveSection("home")}
          />
        ) : null}

        {activeSection === "monthly-report" ? (
          <ReportPanel
            title={copy.monthlyTitle}
            description={copy.monthlyDescription}
            copy={copy}
            stats={[
              [copy.employeesCount, String(summaryStats.employeesCount)],
              [
                copy.activeMonthHours,
                `${summaryStats.currentMonthHours} ${t.common.hoursShort}`,
              ],
              [
                copy.pendingMonthPay,
                `${summaryStats.currentMonthPending} ${t.common.currency}`,
              ],
            ]}
            actionLabel={copy.downloadMonthlyPdf}
            onAction={handleDownloadMonthlyReport}
            onBack={() => setActiveSection("home")}
          />
        ) : null}

        {activeSection === "settings" ? (
          <SettingsPanel copy={copy} onBack={() => setActiveSection("home")} />
        ) : null}
      </section>

      <EmployeeDetailsModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployeeId(null)}
        onDeleteEmployee={handleDeleteEmployee}
        onDayHoursChange={handleDayHoursChange}
        onAddAdvance={handleAddAdvance}
        onRemoveAdvance={handleRemoveAdvance}
      />

      <NewEmployeeModal
        isOpen={isCreatingEmployee}
        onClose={() => setIsCreatingEmployee(false)}
        onSubmit={handleCreateEmployee}
      />
    </>
  );
}

type CabinetCopy = (typeof cabinetCopy)[keyof typeof cabinetCopy];
type TranslationCopy = ReturnType<typeof useLanguage>["t"];

function CabinetMenu({
  copy,
  stats,
  isSaving,
  onNavigate,
  onSignOut,
}: {
  copy: CabinetCopy;
  stats: {
    employeesCount: number;
    currentWeekPending: number;
    currentWeekHours: number;
    currentMonthHours: number;
    currentMonthPending: number;
  };
  isSaving: boolean;
  onNavigate: (section: CabinetSection) => void;
  onSignOut: () => void;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-sky-600">{copy.menu.home}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-500">
          {copy.description}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MenuTile
          title={copy.menu.home}
          hint={copy.hints.home}
          icon="home"
          onClick={() => onNavigate("home")}
        />
        <MenuTile
          title={copy.menu.employees}
          hint={copy.hints.employees}
          icon="employees"
          badge={String(stats.employeesCount)}
          onClick={() => onNavigate("employees")}
        />
        <MenuTile
          title={copy.menu.weeklyReport}
          hint={copy.hints.weeklyReport}
          icon="week"
          badge={String(stats.currentWeekHours)}
          onClick={() => onNavigate("weekly-report")}
        />
        <MenuTile
          title={copy.menu.monthlyReport}
          hint={copy.hints.monthlyReport}
          icon="month"
          badge={String(stats.currentMonthHours)}
          onClick={() => onNavigate("monthly-report")}
        />
        <MenuTile
          title={copy.menu.settings}
          hint={copy.hints.settings}
          icon="settings"
          onClick={() => onNavigate("settings")}
        />
        <MenuTile
          title={copy.menu.signOut}
          hint={copy.hints.signOut}
          icon="logout"
          danger
          disabled={isSaving}
          onClick={onSignOut}
        />
      </div>
    </section>
  );
}

function EmployeesPanel({
  t,
  copy,
  employees,
  errorMessage,
  isSaving,
  onBack,
  onCloseWeek,
  onCreateEmployee,
  onSelectEmployee,
}: {
  t: TranslationCopy;
  copy: CabinetCopy;
  employees: Employee[];
  errorMessage: string;
  isSaving: boolean;
  onBack: () => void;
  onCloseWeek: () => void;
  onCreateEmployee: () => void;
  onSelectEmployee: (employeeId: string) => void;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {copy.backToMenu}
          </button>
          <p className="text-sm font-medium text-sky-600">
            {t.home.employeesEyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {t.home.teamList}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t.home.teamDescription}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCloseWeek}
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t.home.closeWeek}
          </button>
          <button
            type="button"
            onClick={onCreateEmployee}
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {t.home.addEmployee}
          </button>
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {employees.length === 0 ? (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm font-medium text-sky-600">
            {t.home.emptyEyebrow}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            {t.home.emptyTitle}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {t.home.emptyDescription}
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onClick={() => onSelectEmployee(employee.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ReportPanel({
  title,
  description,
  copy,
  stats,
  actionLabel,
  onAction,
  onBack,
}: {
  title: string;
  description: string;
  copy: CabinetCopy;
  stats: Array<[string, string]>;
  actionLabel?: string;
  onAction?: () => void;
  onBack: () => void;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {copy.backToMenu}
        </button>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SettingsPanel({
  copy,
  onBack,
}: {
  copy: CabinetCopy;
  onBack: () => void;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {copy.backToMenu}
      </button>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {copy.settingsTitle}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
        {copy.settingsDescription}
      </p>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <LanguageSwitcher />
      </div>
    </section>
  );
}

const monthlyPdfCopy = {
  uk: {
    title: "Звіт за місяць",
    generatedAt: "Сформовано",
    employee: "Працівник",
    role: "Посада",
    hourlyRate: "Ставка",
    totalHours: "Усього годин",
    grossPay: "Нараховано",
    advances: "Аванси",
    pendingPay: "До виплати",
    currentWeek: "Поточний відкритий тиждень",
    closedWeeks: "Закриті тижні цього місяця",
    noHours: "Годин немає",
    noAdvances: "Авансів немає",
    issued: "Видано",
    weekClosed: "Тиждень",
    summary: "Підсумок",
    saveHint: "У діалозі друку обери “Save as PDF” або “Зберегти як PDF”.",
  },
  en: {
    title: "Monthly report",
    generatedAt: "Generated",
    employee: "Employee",
    role: "Role",
    hourlyRate: "Rate",
    totalHours: "Total hours",
    grossPay: "Gross pay",
    advances: "Advances",
    pendingPay: "Pending pay",
    currentWeek: "Current open week",
    closedWeeks: "Closed weeks this month",
    noHours: "No hours",
    noAdvances: "No advances",
    issued: "Issued",
    weekClosed: "Week",
    summary: "Summary",
    saveHint: "In the print dialog, choose “Save as PDF”.",
  },
  pl: {
    title: "Raport miesięczny",
    generatedAt: "Wygenerowano",
    employee: "Pracownik",
    role: "Stanowisko",
    hourlyRate: "Stawka",
    totalHours: "Łącznie godzin",
    grossPay: "Naliczono",
    advances: "Zaliczki",
    pendingPay: "Do wypłaty",
    currentWeek: "Bieżący otwarty tydzień",
    closedWeeks: "Zamknięte tygodnie tego miesiąca",
    noHours: "Brak godzin",
    noAdvances: "Brak zaliczek",
    issued: "Wydano",
    weekClosed: "Tydzień",
    summary: "Podsumowanie",
    saveHint: "W oknie drukowania wybierz “Save as PDF” lub “Zapisz jako PDF”.",
  },
} as const;

async function downloadMonthlyReportPdf({
  companyName,
  employees,
  language,
  currency,
  hoursLabel,
}: {
  companyName: string;
  employees: Employee[];
  language: LanguageCode;
  currency: string;
  hoursLabel: string;
}) {
  const reportHtml = buildMonthlyReportHtml({
    companyName,
    employees,
    language,
    currency,
    hoursLabel,
  });

  const monthKey = getMonthKey(new Date());
  const fileName = `sweepledger-${sanitizeFileName(companyName)}-${monthKey}.pdf`;

  try {
    const reportCanvas = await renderReportHtmlToCanvas(reportHtml);
    const pdfBlob = await createPdfBlobFromCanvas(reportCanvas);

    downloadBlob(pdfBlob, fileName);
  } catch (error) {
    console.warn("Falling back to canvas rendering for the monthly PDF report.", error);

    const reportCanvas = renderMonthlyReportCanvas({
      companyName,
      employees,
      language,
      currency,
      hoursLabel,
    });
    const pdfBlob = await createPdfBlobFromCanvas(reportCanvas);

    downloadBlob(pdfBlob, fileName);
  }
}

function buildMonthlyReportHtml({
  companyName,
  employees,
  language,
  currency,
  hoursLabel,
}: {
  companyName: string;
  employees: Employee[];
  language: LanguageCode;
  currency: string;
  hoursLabel: string;
}) {
  const labels = monthlyPdfCopy[language];
  const now = new Date();
  const monthSummary = employees.reduce(
    (summary, employee) => {
      const employeeSummary = getCurrentMonthSummary(employee, now, language);

      return {
        monthLabel: employeeSummary.monthLabel,
        totalHours: summary.totalHours + employeeSummary.totalHours,
        grossPay: summary.grossPay + employeeSummary.grossPay,
        advancesTotal: summary.advancesTotal + employeeSummary.advancesTotal,
        pendingPay: summary.pendingPay + employeeSummary.pendingPay,
      };
    },
    {
      monthLabel: getCurrentMonthSummary(
        employees[0] ?? createReportFallbackEmployee(),
        now,
        language,
      ).monthLabel,
      totalHours: 0,
      grossPay: 0,
      advancesTotal: 0,
      pendingPay: 0,
    },
  );
  const generatedAt = new Intl.DateTimeFormat(
    language === "uk" ? "uk-UA" : language === "pl" ? "pl-PL" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(now);

  const employeeSections = employees
    .map((employee) =>
      buildEmployeeMonthlySection({
        employee,
        language,
        currency,
        hoursLabel,
        labels,
        monthKey: getMonthKey(now),
      }),
    )
    .join("");

  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(labels.title)} - ${escapeHtml(companyName)}</title>
  <style>
    * { box-sizing: border-box; }
    @page { size: A4; margin: 0; }
    body {
      margin: 0;
      background: #e2e8f0;
      color: #0f172a;
      font-family: "Segoe UI", Arial, sans-serif;
      line-height: 1.45;
    }
    main {
      max-width: 1040px;
      margin: 0 auto;
      padding: 38px;
      background: #fff;
    }
    h1, h2, h3 { margin: 0; }
    h1 { font-size: 34px; line-height: 1.1; letter-spacing: 0; }
    h2 { font-size: 21px; margin-top: 30px; }
    h3 { font-size: 15px; margin-top: 20px; color: #0f172a; }
    p { margin: 0; }
    ul { margin: 0; padding-left: 18px; }
    li + li { margin-top: 3px; }
    .muted { color: #64748b; }
    .eyebrow {
      color: #0369a1;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .12em;
      text-transform: uppercase;
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-start;
      border-radius: 18px;
      background: linear-gradient(135deg, #0f172a 0%, #075985 62%, #0e7490 100%);
      color: #fff;
      padding: 28px;
      margin-bottom: 24px;
    }
    .header .muted,
    .header .eyebrow {
      color: rgba(255,255,255,.72);
    }
    .header h1 {
      margin-top: 8px;
    }
    .header-meta {
      min-width: 190px;
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 14px;
      background: rgba(255,255,255,.1);
      padding: 14px;
      text-align: right;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 14px 0 28px;
    }
    .stat {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      background: #f8fafc;
    }
    .stat span {
      display: block;
      color: #64748b;
      font-size: 12px;
      margin-bottom: 6px;
    }
    .stat strong { font-size: 19px; color: #0f172a; }
    .employee {
      break-inside: avoid;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 18px;
      margin-top: 20px;
      box-shadow: 0 16px 40px -34px rgba(15, 23, 42, .45);
    }
    .employee-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .rate-box {
      min-width: 150px;
      border-radius: 8px;
      background: #f1f5f9;
      padding: 10px 12px;
      text-align: right;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 9px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-size: 11px;
      text-transform: uppercase;
    }
    .hint {
      margin-top: 22px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      font-size: 12px;
      color: #64748b;
    }
    @media print {
      body { background: #fff; }
      main { max-width: none; padding: 0; }
      .hint { display: none; }
    }
  </style>
</head>
<body>
  <main>
    <section class="header">
      <div>
        <p class="eyebrow">SweepLedger</p>
        <h1>${escapeHtml(labels.title)}</h1>
        <p>${escapeHtml(companyName)} · ${escapeHtml(monthSummary.monthLabel)}</p>
      </div>
      <div class="header-meta">
        <p class="muted">${escapeHtml(labels.generatedAt)}</p>
        <strong>${escapeHtml(generatedAt)}</strong>
      </div>
    </section>

    <section>
      <h2>${escapeHtml(labels.summary)}</h2>
      <div class="summary">
        <div class="stat"><span>${escapeHtml(labels.totalHours)}</span><strong>${monthSummary.totalHours} ${escapeHtml(hoursLabel)}</strong></div>
        <div class="stat"><span>${escapeHtml(labels.grossPay)}</span><strong>${monthSummary.grossPay} ${escapeHtml(currency)}</strong></div>
        <div class="stat"><span>${escapeHtml(labels.advances)}</span><strong>${monthSummary.advancesTotal} ${escapeHtml(currency)}</strong></div>
        <div class="stat"><span>${escapeHtml(labels.pendingPay)}</span><strong>${monthSummary.pendingPay} ${escapeHtml(currency)}</strong></div>
      </div>
    </section>

    ${employeeSections}
    <p class="hint">${escapeHtml(labels.saveHint)}</p>
  </main>
</body>
</html>`;
}

function buildMonthlyReportTextPdf({
  companyName,
  employees,
  language,
  currency,
  hoursLabel,
}: {
  companyName: string;
  employees: Employee[];
  language: LanguageCode;
  currency: string;
  hoursLabel: string;
}) {
  const labels = monthlyPdfCopy[language];
  const now = new Date();
  const locale = language === "uk" ? "uk-UA" : language === "pl" ? "pl-PL" : "en-US";
  const monthKey = getMonthKey(now);
  const generatedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(now);
  const monthLabel = getCurrentMonthSummary(
    employees[0] ?? createReportFallbackEmployee(),
    now,
    language,
  ).monthLabel;
  const totalSummary = employees.reduce(
    (summary, employee) => {
      const employeeSummary = getCurrentMonthSummary(employee, now, language);

      return {
        totalHours: summary.totalHours + employeeSummary.totalHours,
        grossPay: summary.grossPay + employeeSummary.grossPay,
        advancesTotal: summary.advancesTotal + employeeSummary.advancesTotal,
        pendingPay: summary.pendingPay + employeeSummary.pendingPay,
      };
    },
    {
      totalHours: 0,
      grossPay: 0,
      advancesTotal: 0,
      pendingPay: 0,
    },
  );
  const report = createPdfTextDocument();

  report.addText("SweepLedger", 11);
  report.addText(labels.title, 22, true);
  report.addText(`${companyName} · ${monthLabel}`, 12);
  report.addText(`${labels.generatedAt}: ${generatedAt}`, 10);
  report.addGap(10);
  report.addText(labels.summary, 15, true);
  report.addText(`${labels.totalHours}: ${totalSummary.totalHours} ${hoursLabel}`);
  report.addText(`${labels.grossPay}: ${totalSummary.grossPay} ${currency}`);
  report.addText(`${labels.advances}: ${totalSummary.advancesTotal} ${currency}`);
  report.addText(`${labels.pendingPay}: ${totalSummary.pendingPay} ${currency}`);

  employees.forEach((employee) => {
    const summary = getCurrentMonthSummary(employee, now, language);

    report.addDivider();
    report.addText(employee.name, 17, true);
    report.addText(`${labels.role}: ${employee.role}`);
    report.addText(`${labels.hourlyRate}: ${employee.hourlyRate} ${currency}/${hoursLabel}`);
    report.addText(`${labels.totalHours}: ${summary.totalHours} ${hoursLabel}`);
    report.addText(`${labels.grossPay}: ${summary.grossPay} ${currency}`);
    report.addText(`${labels.advances}: ${summary.advancesTotal} ${currency}`);
    report.addText(`${labels.pendingPay}: ${summary.pendingPay} ${currency}`);

    report.addGap(6);
    report.addText(labels.currentWeek, 13, true);
    addWorkLogToPdf(report, employee.workLog, language, hoursLabel, labels.noHours);

    if (employee.advances.length > 0) {
      report.addText(labels.advances, 11, true);
      employee.advances.forEach((advance) => {
        report.addText(
          `- ${getWorkDayLabel(advance.day, language)}: ${advance.amount} ${currency}`,
        );
      });
    } else {
      report.addText(`${labels.advances}: ${labels.noAdvances}`);
    }

    report.addText(`${labels.pendingPay}: ${getPendingPay(employee)} ${currency}`);
    report.addGap(6);
    report.addText(labels.closedWeeks, 13, true);

    const closedWeeks = employee.weekHistory.filter(
      (entry) => entry.monthKey === monthKey,
    );

    if (closedWeeks.length === 0) {
      report.addText(labels.noHours);
    } else {
      closedWeeks.forEach((entry) => {
        report.addText(`${labels.weekClosed}: ${entry.weekLabel} (${entry.closedAt})`, 11, true);
        addWorkLogToPdf(report, entry.workLog, language, hoursLabel, labels.noHours);
        report.addText(`${labels.totalHours}: ${entry.totalHours} ${hoursLabel}`);
        report.addText(`${labels.grossPay}: ${entry.grossPay} ${currency}`);

        if (entry.advances.length > 0) {
          report.addText(labels.advances, 11, true);
          entry.advances.forEach((advance) => {
            report.addText(
              `- ${getWorkDayLabel(advance.day, language)}: ${advance.amount} ${currency}`,
            );
          });
        } else {
          report.addText(`${labels.advances}: ${labels.noAdvances}`);
        }

        report.addText(`${labels.pendingPay}: ${entry.pendingPay} ${currency}`);
        report.addGap(4);
      });
    }
  });

  return report.toBlob();
}

function addWorkLogToPdf(
  report: ReturnType<typeof createPdfTextDocument>,
  workLog: Employee["workLog"],
  language: LanguageCode,
  hoursLabel: string,
  emptyLabel: string,
) {
  const workedDays = workDays.filter((day) => workLog[day.key] > 0);

  if (workedDays.length === 0) {
    report.addText(emptyLabel);
    return;
  }

  workedDays.forEach((day) => {
    report.addText(
      `- ${getWorkDayLabel(day.key, language)}: ${workLog[day.key]} ${hoursLabel}`,
    );
  });
}

function createPdfTextDocument() {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 42;
  const usableWidth = pageWidth - margin * 2;
  const pages: string[][] = [[]];
  let y = pageHeight - margin;

  function currentPage() {
    return pages[pages.length - 1];
  }

  function addPage() {
    pages.push([]);
    y = pageHeight - margin;
  }

  function ensureSpace(height: number) {
    if (y - height < margin) {
      addPage();
    }
  }

  function addRawText(text: string, size: number, bold = false) {
    const lineHeight = size * 1.35;

    ensureSpace(lineHeight);
    currentPage().push(
      `BT /F1 ${size} Tf ${margin} ${y.toFixed(2)} Td ${bold ? "0 Tr " : ""}${encodePdfText(text)} Tj ET\n`,
    );
    y -= lineHeight;
  }

  function addText(text: string, size = 10, bold = false) {
    const maxChars = Math.max(24, Math.floor(usableWidth / (size * 0.52)));
    const words = text.split(/\s+/).filter(Boolean);
    let line = "";

    if (words.length === 0) {
      addRawText("", size, bold);
      return;
    }

    words.forEach((word) => {
      const nextLine = line ? `${line} ${word}` : word;

      if (nextLine.length > maxChars && line) {
        addRawText(line, size, bold);
        line = word;
      } else {
        line = nextLine;
      }
    });

    if (line) {
      addRawText(line, size, bold);
    }
  }

  function addGap(height: number) {
    ensureSpace(height);
    y -= height;
  }

  function addDivider() {
    ensureSpace(28);
    y -= 10;
    currentPage().push(
      `0.82 0.87 0.93 RG ${margin} ${y.toFixed(2)} m ${(margin + usableWidth).toFixed(2)} ${y.toFixed(2)} l S\n`,
    );
    y -= 16;
  }

  function toBlob() {
    return buildPdfFromTextPages(pages, pageWidth, pageHeight);
  }

  return {
    addText,
    addGap,
    addDivider,
    toBlob,
  };
}

function buildPdfFromTextPages(
  pages: string[][],
  pageWidth: number,
  pageHeight: number,
) {
  const encoder = new TextEncoder();
  const chunks: BlobPart[] = [];
  const offsets: number[] = [0];
  let byteLength = 0;

  function push(chunk: string) {
    chunks.push(chunk);
    byteLength += encoder.encode(chunk).length;
  }

  function beginObject(id: number) {
    offsets[id] = byteLength;
    push(`${id} 0 obj\n`);
  }

  const toUnicodeCMap = `/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<0000> <FFFF>
endcodespacerange
1 beginbfrange
<0000> <FFFF> <0000>
endbfrange
endcmap
CMapName currentdict /CMap defineresource pop
end
end`;
  const pageRefs = pages
    .map((_, index) => `${7 + index * 2} 0 R`)
    .join(" ");

  push("%PDF-1.4\n");
  beginObject(1);
  push("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  beginObject(2);
  push(`<< /Type /Pages /Kids [${pageRefs}] /Count ${pages.length} >>\nendobj\n`);
  beginObject(3);
  push("<< /Type /Font /Subtype /Type0 /BaseFont /ArialUnicodeMS /Encoding /Identity-H /DescendantFonts [4 0 R] /ToUnicode 6 0 R >>\nendobj\n");
  beginObject(4);
  push("<< /Type /Font /Subtype /CIDFontType2 /BaseFont /ArialUnicodeMS /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor 5 0 R /DW 520 >>\nendobj\n");
  beginObject(5);
  push("<< /Type /FontDescriptor /FontName /ArialUnicodeMS /Flags 32 /FontBBox [-1000 -300 1200 1000] /ItalicAngle 0 /Ascent 900 /Descent -250 /CapHeight 700 /StemV 80 >>\nendobj\n");
  beginObject(6);
  push(`<< /Length ${encoder.encode(toUnicodeCMap).length} >>\nstream\n${toUnicodeCMap}\nendstream\nendobj\n`);

  pages.forEach((commands, index) => {
    const pageObject = 7 + index * 2;
    const contentObject = pageObject + 1;
    const content = commands.join("");

    beginObject(pageObject);
    push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObject} 0 R >>\nendobj\n`);
    beginObject(contentObject);
    push(`<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream\nendobj\n`);
  });

  const xrefOffset = byteLength;
  const objectCount = 7 + pages.length * 2;

  push(`xref\n0 ${objectCount}\n`);
  push("0000000000 65535 f \n");

  for (let id = 1; id < objectCount; id += 1) {
    push(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  }

  push(
    `trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
  );

  return new Blob(chunks, { type: "application/pdf" });
}

function encodePdfText(text: string) {
  const bytes: number[] = [];

  for (const character of text) {
    const codePoint = character.codePointAt(0) ?? 32;
    const code = codePoint > 0xffff ? 63 : codePoint;

    bytes.push((code >> 8) & 0xff, code & 0xff);
  }

  return `<${bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("")}>`;
}

async function renderReportHtmlToCanvas(html: string) {
  const width = 1240;
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const mainMatch = html.match(/<main>([\s\S]*?)<\/main>/);
  const style = styleMatch?.[1] ?? "";
  const main = mainMatch?.[1] ?? "";
  const wrapper = document.createElement("div");

  wrapper.style.position = "fixed";
  wrapper.style.left = "-10000px";
  wrapper.style.top = "0";
  wrapper.style.width = `${width}px`;
  wrapper.style.background = "#ffffff";
  wrapper.innerHTML = `<style>${style}</style><main>${main}</main>`;
  document.body.appendChild(wrapper);

  const height = Math.max(wrapper.scrollHeight, 1754);
  const xhtmlMain = normalizeSvgXhtml(main);
  const xhtml = `<div xmlns="http://www.w3.org/1999/xhtml"><style>${style}
    body { margin: 0; background: #fff; }
    main { width: ${width}px; max-width: none; min-height: ${height}px; }
  </style><main>${xhtmlMain}</main></div>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%">${xhtml}</foreignObject></svg>`;
  const svgUrl = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );

  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    if (!context) {
      throw new Error("Canvas is not available for PDF generation.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0);

    return canvas;
  } finally {
    URL.revokeObjectURL(svgUrl);
    wrapper.remove();
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not render report image."));
    image.src = src;
  });
}

function normalizeSvgXhtml(html: string) {
  return html
    .replaceAll("<br>", "<br />")
    .replaceAll("<hr>", "<hr />")
    .replaceAll("&nbsp;", "&#160;");
}

function renderMonthlyReportCanvas({
  companyName,
  employees,
  language,
  currency,
  hoursLabel,
}: {
  companyName: string;
  employees: Employee[];
  language: LanguageCode;
  currency: string;
  hoursLabel: string;
}) {
  const labels = monthlyPdfCopy[language];
  const now = new Date();
  const locale = language === "uk" ? "uk-UA" : language === "pl" ? "pl-PL" : "en-US";
  const monthKey = getMonthKey(now);
  const monthLabel = getCurrentMonthSummary(
    employees[0] ?? createReportFallbackEmployee(),
    now,
    language,
  ).monthLabel;
  const generatedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(now);
  const totalSummary = employees.reduce(
    (summary, employee) => {
      const employeeSummary = getCurrentMonthSummary(employee, now, language);

      return {
        totalHours: summary.totalHours + employeeSummary.totalHours,
        grossPay: summary.grossPay + employeeSummary.grossPay,
        advancesTotal: summary.advancesTotal + employeeSummary.advancesTotal,
        pendingPay: summary.pendingPay + employeeSummary.pendingPay,
      };
    },
    {
      totalHours: 0,
      grossPay: 0,
      advancesTotal: 0,
      pendingPay: 0,
    },
  );
  const estimatedHeight =
    620 +
    employees.reduce((height, employee) => {
      const closedWeeks = employee.weekHistory.filter(
        (entry) => entry.monthKey === monthKey,
      );

      return height + 520 + closedWeeks.length * 120;
    }, 0);
  const width = 1240;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = Math.max(1754, estimatedHeight);

  if (!context) {
    throw new Error("Canvas is not available for PDF generation.");
  }

  const left = 56;
  const contentWidth = width - left * 2;
  let y = 56;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const headerGradient = context.createLinearGradient(left, y, width - left, y + 220);

  headerGradient.addColorStop(0, "#0f172a");
  headerGradient.addColorStop(0.62, "#075985");
  headerGradient.addColorStop(1, "#0e7490");
  drawRoundRect(context, left, y, contentWidth, 220, 22, headerGradient);

  context.fillStyle = "rgba(255,255,255,.72)";
  drawCanvasText(context, "SweepLedger", left + 32, y + 42, 18, 760, 24, true);
  context.fillStyle = "#ffffff";
  drawCanvasText(context, labels.title, left + 32, y + 86, 44, 650, 54, true);
  context.fillStyle = "rgba(255,255,255,.86)";
  drawCanvasText(
    context,
    `${companyName} - ${monthLabel}`,
    left + 32,
    y + 150,
    21,
    650,
    30,
  );

  drawRoundRect(
    context,
    width - left - 280,
    y + 42,
    240,
    112,
    16,
    "rgba(255,255,255,.12)",
    "rgba(255,255,255,.22)",
  );
  context.fillStyle = "rgba(255,255,255,.72)";
  drawCanvasText(context, labels.generatedAt, width - left - 252, y + 76, 16, 190, 22);
  context.fillStyle = "#ffffff";
  drawCanvasText(context, generatedAt, width - left - 252, y + 112, 20, 190, 28, true);

  y += 260;
  context.fillStyle = "#0f172a";
  drawCanvasText(context, labels.summary, left, y, 28, contentWidth, 34, true);
  y += 52;
  drawCanvasStatRow(context, left, y, contentWidth, [
    [labels.totalHours, `${totalSummary.totalHours} ${hoursLabel}`],
    [labels.grossPay, `${totalSummary.grossPay} ${currency}`],
    [labels.advances, `${totalSummary.advancesTotal} ${currency}`],
    [labels.pendingPay, `${totalSummary.pendingPay} ${currency}`],
  ]);
  y += 132;

  employees.forEach((employee) => {
    const summary = getCurrentMonthSummary(employee, now, language);
    const closedWeeks = employee.weekHistory.filter(
      (entry) => entry.monthKey === monthKey,
    );
    const cardStartY = y;

    drawRoundRect(context, left, y, contentWidth, 1, 10, "#ffffff");
    y += 26;
    context.fillStyle = "#0f172a";
    drawCanvasText(context, employee.name, left + 24, y, 30, 620, 38, true);
    context.fillStyle = "#64748b";
    drawCanvasText(
      context,
      `${labels.role}: ${employee.role}`,
      left + 24,
      y + 42,
      17,
      620,
      24,
    );
    drawRoundRect(context, width - left - 240, y - 4, 216, 72, 10, "#f1f5f9");
    context.fillStyle = "#64748b";
    drawCanvasText(context, labels.hourlyRate, width - left - 218, y + 20, 15, 170, 20);
    context.fillStyle = "#0f172a";
    drawCanvasText(
      context,
      `${employee.hourlyRate} ${currency}/${hoursLabel}`,
      width - left - 218,
      y + 48,
      20,
      170,
      24,
      true,
    );

    y += 104;
    drawCanvasStatRow(context, left + 24, y, contentWidth - 48, [
      [labels.totalHours, `${summary.totalHours} ${hoursLabel}`],
      [labels.grossPay, `${summary.grossPay} ${currency}`],
      [labels.advances, `${summary.advancesTotal} ${currency}`],
      [labels.pendingPay, `${summary.pendingPay} ${currency}`],
    ]);
    y += 130;

    y = drawCanvasSectionList(
      context,
      left + 24,
      y,
      contentWidth - 48,
      labels.currentWeek,
      [
        `${labels.totalHours}: ${formatWorkLogText(employee.workLog, language, hoursLabel, labels.noHours)}`,
        `${labels.advances}: ${formatAdvancesText(employee.advances, language, currency, labels.noAdvances)}`,
        `${labels.pendingPay}: ${getPendingPay(employee)} ${currency}`,
      ],
    );

    y = drawCanvasSectionList(
      context,
      left + 24,
      y + 8,
      contentWidth - 48,
      labels.closedWeeks,
      closedWeeks.length > 0
        ? closedWeeks.flatMap((entry) => [
            `${labels.weekClosed}: ${entry.weekLabel} (${entry.closedAt})`,
            `${labels.totalHours}: ${formatWorkLogText(entry.workLog, language, hoursLabel, labels.noHours)}`,
            `${labels.grossPay}: ${entry.grossPay} ${currency}`,
            `${labels.advances}: ${formatAdvancesText(entry.advances, language, currency, labels.noAdvances)}`,
            `${labels.pendingPay}: ${entry.pendingPay} ${currency}`,
          ])
        : [labels.noHours],
    );

    drawRoundRect(
      context,
      left,
      cardStartY,
      contentWidth,
      y - cardStartY + 22,
      14,
      "transparent",
      "#cbd5e1",
    );
    y += 54;
  });

  return trimCanvas(canvas, Math.ceil(y + 56));
}

function drawRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string | CanvasGradient,
  stroke?: string,
) {
  context.save();
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();

  if (fill !== "transparent") {
    context.fillStyle = fill;
    context.fill();
  }

  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = 1.5;
    context.stroke();
  }

  context.restore();
}

function drawCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  maxWidth: number,
  lineHeight: number,
  bold = false,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  context.font = `${bold ? "700" : "400"} ${size}px "Segoe UI", Arial, sans-serif`;

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (context.measureText(nextLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });

  return Math.max(lineHeight, lines.length * lineHeight);
}

function drawCanvasStatRow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  stats: Array<[string, string]>,
) {
  const gap = 16;
  const statWidth = (width - gap * (stats.length - 1)) / stats.length;

  stats.forEach(([label, value], index) => {
    const statX = x + index * (statWidth + gap);

    drawRoundRect(context, statX, y, statWidth, 96, 10, "#f8fafc", "#e2e8f0");
    context.fillStyle = "#64748b";
    drawCanvasText(context, label, statX + 16, y + 30, 15, statWidth - 32, 20);
    context.fillStyle = "#0f172a";
    drawCanvasText(context, value, statX + 16, y + 66, 24, statWidth - 32, 28, true);
  });
}

function drawCanvasSectionList(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  title: string,
  rows: string[],
) {
  context.fillStyle = "#0f172a";
  drawCanvasText(context, title, x, y, 20, width, 26, true);
  y += 36;

  rows.forEach((row) => {
    drawRoundRect(context, x, y, width, 1, 0, "#e2e8f0");
    context.fillStyle = "#334155";
    const rowHeight = drawCanvasText(context, row, x + 12, y + 26, 17, width - 24, 24);

    y += Math.max(46, rowHeight + 20);
  });

  return y + 10;
}

function formatWorkLogText(
  workLog: Employee["workLog"],
  language: LanguageCode,
  hoursLabel: string,
  emptyLabel: string,
) {
  const rows = workDays
    .filter((day) => workLog[day.key] > 0)
    .map(
      (day) =>
        `${getWorkDayLabel(day.key, language)}: ${workLog[day.key]} ${hoursLabel}`,
    );

  return rows.length > 0 ? rows.join("; ") : emptyLabel;
}

function formatAdvancesText(
  advances: Employee["advances"],
  language: LanguageCode,
  currency: string,
  emptyLabel: string,
) {
  const rows = advances.map(
    (advance) =>
      `${getWorkDayLabel(advance.day, language)}: ${advance.amount} ${currency}`,
  );

  return rows.length > 0 ? rows.join("; ") : emptyLabel;
}

function trimCanvas(canvas: HTMLCanvasElement, height: number) {
  const trimmedCanvas = document.createElement("canvas");
  const context = trimmedCanvas.getContext("2d");

  trimmedCanvas.width = canvas.width;
  trimmedCanvas.height = Math.min(canvas.height, Math.max(1, height));

  if (!context) {
    throw new Error("Canvas is not available for PDF generation.");
  }

  context.drawImage(
    canvas,
    0,
    0,
    trimmedCanvas.width,
    trimmedCanvas.height,
    0,
    0,
    trimmedCanvas.width,
    trimmedCanvas.height,
  );

  return trimmedCanvas;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function createPdfBlobFromCanvas(canvas: HTMLCanvasElement) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const pagePixelHeight = Math.floor((canvas.width * pageHeight) / pageWidth);
  const pages: Array<{
    imageBytes: Uint8Array;
    width: number;
    height: number;
    renderHeight: number;
  }> = [];

  for (let y = 0; y < canvas.height; y += pagePixelHeight) {
    const sliceHeight = Math.min(pagePixelHeight, canvas.height - y);
    const pageCanvas = document.createElement("canvas");
    const pageContext = pageCanvas.getContext("2d");

    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    if (!pageContext) {
      throw new Error("Canvas is not available for PDF generation.");
    }

    pageContext.fillStyle = "#ffffff";
    pageContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    pageContext.drawImage(
      canvas,
      0,
      y,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight,
    );

    pages.push({
      imageBytes: dataUrlToBytes(pageCanvas.toDataURL("image/jpeg", 0.92)),
      width: pageCanvas.width,
      height: pageCanvas.height,
      renderHeight: pageHeight * (sliceHeight / pagePixelHeight),
    });
  }

  return buildPdfFromJpegPages(pages, pageWidth, pageHeight);
}

function buildPdfFromJpegPages(
  pages: Array<{
    imageBytes: Uint8Array;
    width: number;
    height: number;
    renderHeight: number;
  }>,
  pageWidth: number,
  pageHeight: number,
) {
  const encoder = new TextEncoder();
  const chunks: BlobPart[] = [];
  const offsets: number[] = [0];
  let byteLength = 0;

  function push(chunk: string | Uint8Array) {
    if (typeof chunk === "string") {
      chunks.push(chunk);
    } else {
      const buffer = new ArrayBuffer(chunk.byteLength);
      const view = new Uint8Array(buffer);

      view.set(chunk);
      chunks.push(buffer);
    }

    byteLength += typeof chunk === "string" ? encoder.encode(chunk).length : chunk.length;
  }

  function beginObject(id: number) {
    offsets[id] = byteLength;
    push(`${id} 0 obj\n`);
  }

  const pageRefs = pages
    .map((_, index) => `${3 + index * 3} 0 R`)
    .join(" ");

  push("%PDF-1.4\n");
  beginObject(1);
  push("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  beginObject(2);
  push(`<< /Type /Pages /Kids [${pageRefs}] /Count ${pages.length} >>\nendobj\n`);

  pages.forEach((page, index) => {
    const pageObject = 3 + index * 3;
    const imageObject = pageObject + 1;
    const contentObject = pageObject + 2;
    const yOffset = pageHeight - page.renderHeight;
    const content = `q\n${pageWidth} 0 0 ${page.renderHeight.toFixed(2)} 0 ${yOffset.toFixed(2)} cm\n/Im${index} Do\nQ\n`;

    beginObject(pageObject);
    push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im${index} ${imageObject} 0 R >> >> /Contents ${contentObject} 0 R >>\nendobj\n`,
    );

    beginObject(imageObject);
    push(
      `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.imageBytes.length} >>\nstream\n`,
    );
    push(page.imageBytes);
    push("\nendstream\nendobj\n");

    beginObject(contentObject);
    push(`<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream\nendobj\n`);
  });

  const xrefOffset = byteLength;
  const objectCount = 3 + pages.length * 3;

  push(`xref\n0 ${objectCount}\n`);
  push("0000000000 65535 f \n");

  for (let id = 1; id < objectCount; id += 1) {
    push(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  }

  push(
    `trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
  );

  return new Blob(chunks, { type: "application/pdf" });
}

function dataUrlToBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function buildEmployeeMonthlySection({
  employee,
  language,
  currency,
  hoursLabel,
  labels,
  monthKey,
}: {
  employee: Employee;
  language: LanguageCode;
  currency: string;
  hoursLabel: string;
  labels: (typeof monthlyPdfCopy)[LanguageCode];
  monthKey: string;
}) {
  const summary = getCurrentMonthSummary(employee, new Date(), language);
  const currentWeekRows = buildWorkLogRows(employee.workLog, language, hoursLabel);
  const currentAdvances = employee.advances
    .map(
      (advance) =>
        `<li>${escapeHtml(getWorkDayLabel(advance.day, language))}: ${advance.amount} ${escapeHtml(currency)}</li>`,
    )
    .join("");
  const closedWeeks = employee.weekHistory.filter(
    (entry) => entry.monthKey === monthKey,
  );
  const closedWeeksHtml =
    closedWeeks.length > 0
      ? closedWeeks
          .map((entry) => {
            const advances =
              entry.advances.length > 0
                ? `<ul>${entry.advances
                    .map(
                      (advance) =>
                        `<li>${escapeHtml(getWorkDayLabel(advance.day, language))}: ${advance.amount} ${escapeHtml(currency)}</li>`,
                    )
                    .join("")}</ul>`
                : escapeHtml(labels.noAdvances);

            return `<tr>
              <td>${escapeHtml(entry.weekLabel)}<br /><span class="muted">${escapeHtml(entry.closedAt)}</span></td>
              <td>${buildWorkLogRows(entry.workLog, language, hoursLabel)}</td>
              <td>${entry.totalHours} ${escapeHtml(hoursLabel)}</td>
              <td>${entry.grossPay} ${escapeHtml(currency)}</td>
              <td>${advances}</td>
              <td>${entry.pendingPay} ${escapeHtml(currency)}</td>
            </tr>`;
          })
          .join("")
      : `<tr><td colspan="6" class="muted">${escapeHtml(labels.noHours)}</td></tr>`;

  return `<section class="employee">
    <div class="employee-head">
      <div>
        <h2>${escapeHtml(employee.name)}</h2>
        <p class="muted">${escapeHtml(labels.role)}: ${escapeHtml(employee.role)}</p>
      </div>
      <div class="rate-box">
        <p class="muted">${escapeHtml(labels.hourlyRate)}</p>
        <strong>${employee.hourlyRate} ${escapeHtml(currency)}/${escapeHtml(hoursLabel)}</strong>
      </div>
    </div>

    <div class="summary">
      <div class="stat"><span>${escapeHtml(labels.totalHours)}</span><strong>${summary.totalHours} ${escapeHtml(hoursLabel)}</strong></div>
      <div class="stat"><span>${escapeHtml(labels.grossPay)}</span><strong>${summary.grossPay} ${escapeHtml(currency)}</strong></div>
      <div class="stat"><span>${escapeHtml(labels.advances)}</span><strong>${summary.advancesTotal} ${escapeHtml(currency)}</strong></div>
      <div class="stat"><span>${escapeHtml(labels.pendingPay)}</span><strong>${summary.pendingPay} ${escapeHtml(currency)}</strong></div>
    </div>

    <h3>${escapeHtml(labels.currentWeek)}</h3>
    <table>
      <thead>
        <tr>
          <th>${escapeHtml(labels.totalHours)}</th>
          <th>${escapeHtml(labels.advances)}</th>
          <th>${escapeHtml(labels.pendingPay)}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${currentWeekRows}</td>
          <td>${currentAdvances ? `<ul>${currentAdvances}</ul>` : escapeHtml(labels.noAdvances)}</td>
          <td>${getPendingPay(employee)} ${escapeHtml(currency)}</td>
        </tr>
      </tbody>
    </table>

    <h3>${escapeHtml(labels.closedWeeks)}</h3>
    <table>
      <thead>
        <tr>
          <th>${escapeHtml(labels.weekClosed)}</th>
          <th>${escapeHtml(labels.totalHours)}</th>
          <th>${escapeHtml(labels.totalHours)}</th>
          <th>${escapeHtml(labels.grossPay)}</th>
          <th>${escapeHtml(labels.advances)}</th>
          <th>${escapeHtml(labels.pendingPay)}</th>
        </tr>
      </thead>
      <tbody>${closedWeeksHtml}</tbody>
    </table>
  </section>`;
}

function buildWorkLogRows(
  workLog: Employee["workLog"],
  language: LanguageCode,
  hoursLabel: string,
) {
  const rows = workDays
    .filter((day) => workLog[day.key] > 0)
    .map(
      (day) =>
        `<li>${escapeHtml(getWorkDayLabel(day.key, language))}: ${workLog[day.key]} ${escapeHtml(hoursLabel)}</li>`,
    )
    .join("");

  return rows ? `<ul>${rows}</ul>` : escapeHtml(monthlyPdfCopy[language].noHours);
}

function createReportFallbackEmployee(): Employee {
  return {
    id: "fallback",
    name: "",
    role: "",
    hourlyRate: 0,
    status: "active",
    currentWeekId: null,
    currentWeekStartDate: null,
    workLog: {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    },
    advances: [],
    weekHistory: [],
  };
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sanitizeFileName(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїєґąćęłńóśźż_-]+/gi, "-")
      .replace(/^-+|-+$/g, "") || "report"
  );
}

void buildMonthlyReportTextPdf;

function MenuTile({
  title,
  hint,
  icon,
  badge,
  danger = false,
  disabled = false,
  onClick,
}: {
  title: string;
  hint: string;
  icon: MenuIconName;
  badge?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group flex aspect-square min-h-44 flex-col justify-between rounded-lg border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
        danger
          ? "border-rose-200 bg-rose-50 hover:border-rose-300 hover:bg-rose-100"
          : "border-slate-200 bg-slate-50 hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-[0_24px_50px_-30px_rgba(14,165,233,0.45)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${
            danger
              ? "bg-rose-600 text-white"
              : "bg-slate-950 text-white group-hover:bg-sky-600"
          }`}
        >
          <MenuIcon name={icon} />
        </span>
        {badge ? (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {badge}
          </span>
        ) : null}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
        <p className="mt-2 text-sm leading-5 text-slate-500">{hint}</p>
      </div>
    </button>
  );
}

type MenuIconName = "home" | "employees" | "week" | "month" | "settings" | "logout";

function MenuIcon({ name }: { name: MenuIconName }) {
  const commonProps = {
    className: "h-6 w-6",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "home") {
    return (
      <svg {...commonProps}>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </svg>
    );
  }

  if (name === "employees") {
    return (
      <svg {...commonProps}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (name === "week") {
    return (
      <svg {...commonProps}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
      </svg>
    );
  }

  if (name === "month") {
    return (
      <svg {...commonProps}>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-3" />
      </svg>
    );
  }

  if (name === "settings") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2 2 0 1 1-2.82 2.82l-.04-.04A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6 1.8 1.8 0 0 0-.5 1.2V21a2 2 0 1 1-4 0v-.1a1.8 1.8 0 0 0-.5-1.2 1.8 1.8 0 0 0-1-.6 1.8 1.8 0 0 0-1.98.36l-.04.04a2 2 0 1 1-2.82-2.82l.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1 1.8 1.8 0 0 0-1.2-.5H3a2 2 0 1 1 0-4h.1a1.8 1.8 0 0 0 1.2-.5 1.8 1.8 0 0 0 .6-1 1.8 1.8 0 0 0-.36-1.98l-.04-.04A2 2 0 1 1 7.32 3.16l.04.04A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.6 1.8 1.8 0 0 0 .5-1.2V3a2 2 0 1 1 4 0v.1a1.8 1.8 0 0 0 .5 1.2 1.8 1.8 0 0 0 1 .6 1.8 1.8 0 0 0 1.98-.36l.04-.04a2 2 0 1 1 2.82 2.82l-.04.04A1.8 1.8 0 0 0 19.4 9c0 .38.22.72.6 1 .33.25.76.5 1.2.5h.8a2 2 0 1 1 0 4h-.8a1.8 1.8 0 0 0-1.2.5 1.8 1.8 0 0 0-.6 1Z" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M10 17 15 12 10 7" />
      <path d="M15 12H3" />
      <path d="M21 3v18" />
    </svg>
  );
}

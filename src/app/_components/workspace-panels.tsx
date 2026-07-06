import type { Employee } from "../_data/employees";
import type { Dictionary } from "../_i18n/translations";
import { EmployeeCard } from "./employee-card";
import type { CabinetCopy, CabinetSection } from "./employees-section-copy";

export function CabinetMenu({
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

export function EmployeesPanel({
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
  t: Dictionary;
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

export function ReportPanel({
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

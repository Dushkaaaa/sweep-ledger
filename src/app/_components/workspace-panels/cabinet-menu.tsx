import { MenuTile } from "./menu-tile";
import type { CabinetCopy, CabinetSection } from "../employees-section-copy";

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
    <section className="rounded-4xl border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-sky-600">{copy.menu.home}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {copy.title}
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-500">
          {copy.description}
        </p>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
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
          title={copy.menu.clients}
          hint={copy.hints.clients}
          icon="clients"
          onClick={() => onNavigate("clients")}
        />
        <MenuTile
          title={copy.menu.finance}
          hint={copy.hints.finance}
          icon="finance"
          onClick={() => onNavigate("finance")}
        />
        <MenuTile
          title={copy.menu.statistics}
          hint={copy.hints.statistics}
          icon="stats"
          onClick={() => onNavigate("statistics")}
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

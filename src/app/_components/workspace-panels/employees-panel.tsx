import type { Employee } from "../../_data/employees";
import type { Dictionary } from "../../_i18n/translations";
import { EmployeeCard } from "../employee-card";
import type { CabinetCopy } from "../employees-section-copy";

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
    <section className="rounded-4xl border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
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
          <p className="mt-1 text-sm text-slate-500">
            {t.home.teamDescription}
          </p>
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
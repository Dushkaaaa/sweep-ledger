import {
  type Employee,
  getCurrentMonthSummary,
  getGrossPay,
  getPendingPay,
  getShiftSummary,
  getTotalAdvances,
  getTotalHours,
} from "../_data/employees";

type EmployeeCardProps = {
  employee: Employee;
  onClick: () => void;
};

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  const weekHours = getTotalHours(employee.workLog);
  const progress = Math.min((weekHours / 40) * 100, 100);
  const grossPay = getGrossPay(employee);
  const advances = getTotalAdvances(employee.advances);
  const pending = getPendingPay(employee);
  const monthSummary = getCurrentMonthSummary(employee);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-[0_24px_50px_-30px_rgba(14,165,233,0.45)]"
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-100 blur-2xl transition group-hover:bg-cyan-100" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-lg font-bold text-white shadow-lg shadow-sky-500/30">
              {employee.name.slice(0, 1)}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              {employee.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{employee.role}</p>
          </div>

          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            До виплати {pending} PLN
          </span>
        </div>

        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Поточний тиждень</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {weekHours} год
              </p>
            </div>
            <p className="text-right text-sm font-medium text-emerald-600">
              {getShiftSummary(employee.workLog)}
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-sky-500 to-cyan-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-900 p-4 text-white">
            <dt className="text-white/65">Ставка</dt>
            <dd className="mt-2 text-lg font-semibold">
              {employee.hourlyRate} PLN/год
            </dd>
          </div>
          <div className="rounded-2xl bg-sky-50 p-4 text-slate-900 ring-1 ring-sky-100">
            <dt className="text-slate-500">Аванси</dt>
            <dd className="mt-2 text-lg font-semibold">{advances} PLN</dd>
          </div>
        </dl>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Нараховано{" "}
          <span className="font-semibold text-slate-900">{grossPay} PLN</span>
        </div>

        <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-600">
          За місяць{" "}
          <span className="font-semibold text-slate-900">
            {monthSummary.totalHours} год / {monthSummary.pendingPay} PLN
          </span>
        </div>

        <p className="mt-4 text-sm font-medium text-sky-700">
          Натисни, щоб переглянути деталі, історію тижнів і підсумок за місяць
        </p>
      </div>
    </button>
  );
}

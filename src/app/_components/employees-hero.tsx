type EmployeesHeroProps = {
  companyName: string;
  employeesCount: number;
  currentWeekPending: number;
  currentWeekHours: number;
  currentMonthHours: number;
  currentMonthPending: number;
};

export function EmployeesHero({
  companyName,
  employeesCount,
  currentWeekPending,
  currentWeekHours,
  currentMonthHours,
  currentMonthPending,
}: EmployeesHeroProps) {
  return (
    <header className="overflow-hidden rounded-[2rem] bg-linear-to-br from-sky-600 via-cyan-500 to-teal-400 p-6 text-white shadow-[0_24px_80px_-32px_rgba(14,116,144,0.65)] sm:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">
              {companyName}
            </p>
            <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Команда працівників під контролем
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-50/90 sm:text-base">
              Закривай тиждень, архівуй години та автоматично збирай підсумок за
              місяць.
            </p>
          </div>

          <div className="hidden rounded-3xl border border-white/20 bg-white/12 px-4 py-3 backdrop-blur-sm sm:block">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
              Активних
            </p>
            <p className="mt-2 text-3xl font-semibold">{employeesCount}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/75">До виплати за тиждень</p>
            <p className="mt-2 text-2xl font-semibold">
              {currentWeekPending} PLN
            </p>
          </div>
          <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/75">Годин за тиждень</p>
            <p className="mt-2 text-2xl font-semibold">{currentWeekHours} год</p>
          </div>
          <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/75">Годин за місяць</p>
            <p className="mt-2 text-2xl font-semibold">{currentMonthHours} год</p>
          </div>
          <div className="rounded-3xl border border-white/18 bg-white/14 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/75">До виплати за місяць</p>
            <p className="mt-2 text-2xl font-semibold">
              {currentMonthPending} PLN
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

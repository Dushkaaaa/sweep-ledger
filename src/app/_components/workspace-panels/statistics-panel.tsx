// import { useMemo } from "react";
// import { getEmployeePerformanceMetrics, type Employee } from "../../_data/employees";
// import type { CabinetCopy } from "../employees-section-copy";

// export function StatisticsPanel({
//   copy,
//   employees,
//   onBack,
// }: {
//   copy: CabinetCopy;
//   employees: Employee[];
//   onBack: () => void;
// }) {
//   const rankedEmployees = useMemo(() => {
//     return [...employees].sort((left, right) => {
//       const leftMetrics = getEmployeePerformanceMetrics(left);
//       const rightMetrics = getEmployeePerformanceMetrics(right);

//       return rightMetrics.totalHours - leftMetrics.totalHours;
//     });
//   }, [employees]);

//   return (
//     <section className="rounded-4xl border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
//       <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <button
//           type="button"
//           onClick={onBack}
//           className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//         >
//           {copy.backToMenu}
//         </button>
//       </div>

//       <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
//         {copy.statisticsTitle}
//       </h2>
//       <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
//         {copy.statisticsDescription}
//       </p>

//       <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
//         <div className="space-y-3">
//           {rankedEmployees.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
//               {copy.statisticsSummary}
//             </div>
//           ) : (
//             rankedEmployees.map((employee) => {
//               const metrics = getEmployeePerformanceMetrics(employee);
//               const isHighPerformer = metrics.totalHours >= 35;
//               const isNeedsAttention =
//                 metrics.totalHours < 20 || metrics.sickLeave > 0;

//               return (
//                 <div
//                   key={employee.id}
//                   className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
//                 >
//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//                     <div>
//                       <p className="text-base font-semibold text-slate-900">
//                         {employee.name}
//                       </p>
//                       <p className="mt-1 text-sm text-slate-500">
//                         {employee.role}
//                       </p>
//                     </div>
//                     <span
//                       className={`rounded-full px-3 py-1 text-xs font-semibold ${isHighPerformer ? "bg-emerald-100 text-emerald-700" : isNeedsAttention ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"}`}
//                     >
//                       {isHighPerformer
//                         ? copy.statisticsStatusTopPerformer
//                         : isNeedsAttention
//                           ? copy.statisticsStatusNeedsAttention
//                           : copy.statisticsStatusSteady}
//                     </span>
//                   </div>

//                   <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
//                     <div className="rounded-xl border border-slate-200 bg-white p-3">
//                       <p className="text-xs uppercase tracking-wide text-slate-500">
//                         {copy.statisticsMetricHours}
//                       </p>
//                       <p className="mt-2 text-lg font-semibold text-slate-900">
//                         {metrics.totalHours}
//                       </p>
//                     </div>
//                     <div className="rounded-xl border border-slate-200 bg-white p-3">
//                       <p className="text-xs uppercase tracking-wide text-slate-500">
//                         {copy.statisticsMetricWorkedDays}
//                       </p>
//                       <p className="mt-2 text-lg font-semibold text-slate-900">
//                         {metrics.workedDays}
//                       </p>
//                     </div>
//                     <div className="rounded-xl border border-slate-200 bg-white p-3">
//                       <p className="text-xs uppercase tracking-wide text-slate-500">
//                         {copy.statisticsMetricDaysOff}
//                       </p>
//                       <p className="mt-2 text-lg font-semibold text-slate-900">
//                         {metrics.daysOff}
//                       </p>
//                     </div>
//                     <div className="rounded-xl border border-slate-200 bg-white p-3">
//                       <p className="text-xs uppercase tracking-wide text-slate-500">
//                         {copy.statisticsMetricSickLeave}
//                       </p>
//                       <p className="mt-2 text-lg font-semibold text-slate-900">
//                         {metrics.sickLeave}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="mt-3 text-sm text-slate-500">
//                     {copy.statisticsMetricAverage}: {metrics.averageHoursPerDay}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//           <p className="text-sm font-semibold text-slate-900">
//             {copy.statisticsSummary}
//           </p>
//           <div className="mt-4 space-y-3 text-sm text-slate-600">
//             <div className="rounded-xl border border-slate-200 bg-white p-3">
//               <p className="font-semibold text-slate-900">
//                 {copy.statisticsSidebarTopPerformer}
//               </p>
//               <p className="mt-1">
//                 {rankedEmployees[0]?.name ?? copy.statisticsSidebarNoData}
//               </p>
//             </div>
//             <div className="rounded-xl border border-slate-200 bg-white p-3">
//               <p className="font-semibold text-slate-900">
//                 {copy.statisticsSidebarNeedsAttention}
//               </p>
//               <p className="mt-1">
//                 {rankedEmployees.find(
//                   (employee) =>
//                     getEmployeePerformanceMetrics(employee).totalHours < 20,
//                 )?.name ?? copy.statisticsSidebarNoData}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
import { useMemo, useState } from "react";
import { getEmployeePerformanceMetrics, type Employee } from "../../_data/employees";
import type { CabinetCopy } from "../employees-section-copy";

type SortKey = "name" | "hours" | "workedDays" | "daysOff" | "sickLeave";
type StatusFilter = "all" | "top-performer" | "needs-attention" | "steady";

function getEmployeeStatus(employee: Employee): Exclude<StatusFilter, "all"> {
  const metrics = getEmployeePerformanceMetrics(employee);

  if (metrics.totalHours >= 35) return "top-performer";
  if (metrics.totalHours < 20 || metrics.sickLeave > 0) return "needs-attention";
  return "steady";
}

export function StatisticsPanel({
  copy,
  employees,
  onBack,
}: {
  copy: CabinetCopy;
  employees: Employee[];
  onBack: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("hours");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredAndSortedEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = employees.filter((employee) => {
      const matchesQuery =
        !query ||
        employee.name.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || getEmployeeStatus(employee) === statusFilter;

      return matchesQuery && matchesStatus;
    });

    return [...filtered].sort((left, right) => {
      if (sortKey === "name") {
        return left.name.localeCompare(right.name);
      }

      const leftMetrics = getEmployeePerformanceMetrics(left);
      const rightMetrics = getEmployeePerformanceMetrics(right);

      if (sortKey === "hours") {
        return rightMetrics.totalHours - leftMetrics.totalHours;
      }
      if (sortKey === "workedDays") {
        return rightMetrics.workedDays - leftMetrics.workedDays;
      }
      if (sortKey === "daysOff") {
        return rightMetrics.daysOff - leftMetrics.daysOff;
      }
      return rightMetrics.sickLeave - leftMetrics.sickLeave;
    });
  }, [employees, searchQuery, sortKey, statusFilter]);

  const rankedEmployees = useMemo(() => {
    return [...employees].sort((left, right) => {
      const leftMetrics = getEmployeePerformanceMetrics(left);
      const rightMetrics = getEmployeePerformanceMetrics(right);

      return rightMetrics.totalHours - leftMetrics.totalHours;
    });
  }, [employees]);

  const filterOptions: Array<{ value: StatusFilter; label: string }> = [
    { value: "all", label: copy.statisticsFilterAll },
    { value: "top-performer", label: copy.statisticsFilterTopPerformer },
    { value: "needs-attention", label: copy.statisticsFilterNeedsAttention },
    { value: "steady", label: copy.statisticsFilterSteady },
  ];

  const sortOptions: Array<{ value: SortKey; label: string }> = [
    { value: "hours", label: copy.statisticsSortHours },
    { value: "name", label: copy.statisticsSortName },
    { value: "workedDays", label: copy.statisticsSortWorkedDays },
    { value: "daysOff", label: copy.statisticsSortDaysOff },
    { value: "sickLeave", label: copy.statisticsSortSickLeave },
  ];

  return (
    <section className="rounded-4xl border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {copy.backToMenu}
        </button>
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {copy.statisticsTitle}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
        {copy.statisticsDescription}
      </p>

      {/* Search, sort, filter controls */}
      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={copy.statisticsSearchPlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 lg:max-w-xs"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="whitespace-nowrap">{copy.statisticsSortLabel}</span>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === option.value
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          {filteredAndSortedEmployees.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <p className="text-sm font-semibold text-slate-900">
                {copy.statisticsNoResultsTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {copy.statisticsNoResultsDescription}
              </p>
            </div>
          ) : (
            filteredAndSortedEmployees.map((employee) => {
              const metrics = getEmployeePerformanceMetrics(employee);
              const isHighPerformer = metrics.totalHours >= 35;
              const isNeedsAttention =
                metrics.totalHours < 20 || metrics.sickLeave > 0;

              return (
                <div
                  key={employee.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {employee.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {employee.role}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${isHighPerformer ? "bg-emerald-100 text-emerald-700" : isNeedsAttention ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"}`}
                    >
                      {isHighPerformer
                        ? copy.statisticsStatusTopPerformer
                        : isNeedsAttention
                          ? copy.statisticsStatusNeedsAttention
                          : copy.statisticsStatusSteady}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        {copy.statisticsMetricHours}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {metrics.totalHours}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        {copy.statisticsMetricWorkedDays}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {metrics.workedDays}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        {copy.statisticsMetricDaysOff}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {metrics.daysOff}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        {copy.statisticsMetricSickLeave}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {metrics.sickLeave}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-slate-500">
                    {copy.statisticsMetricAverage}: {metrics.averageHoursPerDay}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            {copy.statisticsSummary}
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="font-semibold text-slate-900">
                {copy.statisticsSidebarTopPerformer}
              </p>
              <p className="mt-1">
                {rankedEmployees[0]?.name ?? copy.statisticsSidebarNoData}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="font-semibold text-slate-900">
                {copy.statisticsSidebarNeedsAttention}
              </p>
              <p className="mt-1">
                {rankedEmployees.find(
                  (employee) =>
                    getEmployeePerformanceMetrics(employee).totalHours < 20,
                )?.name ?? copy.statisticsSidebarNoData}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
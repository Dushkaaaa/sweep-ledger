import {
  type Employee,
  getCurrentMonthSummary,
  getPendingPay,
  getTotalHours,
} from "../../_data/employees";
import type { LanguageCode } from "../../_i18n/translations";

export type WorkspaceSummary = {
  employeesCount: number;
  currentWeekPending: number;
  currentWeekHours: number;
  currentMonthHours: number;
  currentMonthPending: number;
};

export function getWorkspaceSummary(
  employees: Employee[],
  language: LanguageCode,
  currentDate = new Date(),
): WorkspaceSummary {
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
      const employeeSummary = getCurrentMonthSummary(
        employee,
        currentDate,
        language,
      );

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

  return {
    employeesCount: employees.length,
    currentWeekPending,
    currentWeekHours,
    currentMonthHours: currentMonthSummary.totalHours,
    currentMonthPending: currentMonthSummary.pendingPay,
  };
}

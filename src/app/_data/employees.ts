import {
  dictionaries,
  type DayKey,
  type LanguageCode,
} from "../_i18n/translations";

export const workDays = [
  { key: "monday" },
  { key: "tuesday" },
  { key: "wednesday" },
  { key: "thursday" },
  { key: "friday" },
  { key: "saturday" },
  { key: "sunday" },
] as const;

export type WorkDayKey = (typeof workDays)[number]["key"];

export type WorkLog = Record<WorkDayKey, number>;

export type Advance = {
  id: string;
  day: WorkDayKey;
  amount: number;
};

export type WeekHistoryEntry = {
  id: string;
  monthKey: string;
  monthLabel: string;
  closedAt: string;
  weekLabel: string;
  totalHours: number;
  grossPay: number;
  advancesTotal: number;
  pendingPay: number;
  workLog: WorkLog;
  advances: Advance[];
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  status: "active";
  currentWeekId: string | null;
  currentWeekStartDate: string | null;
  workLog: WorkLog;
  advances: Advance[];
  weekHistory: WeekHistoryEntry[];
};

export type NewEmployeeInput = {
  name: string;
  role: string;
  hourlyRate: number;
};

export type MonthSummary = {
  monthKey: string;
  monthLabel: string;
  totalHours: number;
  grossPay: number;
  advancesTotal: number;
  pendingPay: number;
};

function getLocale(language: LanguageCode) {
  return language === "uk" ? "uk-UA" : language === "pl" ? "pl-PL" : "en-US";
}

export function createEmptyWorkLog(): WorkLog {
  return {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  };
}

export function getTotalHours(workLog: WorkLog) {
  return Object.values(workLog).reduce((total, hours) => total + hours, 0);
}

export function getWorkedDaysCount(workLog: WorkLog) {
  return Object.values(workLog).filter((hours) => hours > 0).length;
}

export function getShiftSummary(
  workLog: WorkLog,
  language: LanguageCode = "uk",
) {
  const workedDays = getWorkedDaysCount(workLog);
  const labels = dictionaries[language].shiftSummary;

  if (workedDays === 0) {
    return labels.none;
  }

  if (workedDays === 1) {
    return labels.one;
  }

  if (workedDays >= 2 && workedDays <= 4) {
    return labels.few.replace("{count}", String(workedDays));
  }

  return labels.many.replace("{count}", String(workedDays));
}

export function getTotalAdvances(advances: Advance[]) {
  return advances.reduce((total, advance) => total + advance.amount, 0);
}

export function getGrossPay(employee: Pick<Employee, "workLog" | "hourlyRate">) {
  return getTotalHours(employee.workLog) * employee.hourlyRate;
}

export function getPendingPay(
  employee: Pick<Employee, "workLog" | "hourlyRate" | "advances">,
) {
  return Math.max(0, getGrossPay(employee) - getTotalAdvances(employee.advances));
}

export function getWorkDayLabel(
  day: WorkDayKey,
  language: LanguageCode = "uk",
) {
  return dictionaries[language].days[day as DayKey] ?? day;
}

export function getMonthKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${date.getFullYear()}-${month}`;
}

export function getMonthLabel(date: Date, language: LanguageCode = "uk") {
  return new Intl.DateTimeFormat(getLocale(language), {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getDateLabel(date: Date, language: LanguageCode = "uk") {
  return new Intl.DateTimeFormat(getLocale(language), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getCurrentMonthSummary(
  employee: Employee,
  referenceDate: Date = new Date(),
  language: LanguageCode = "uk",
): MonthSummary {
  const currentMonthKey = getMonthKey(referenceDate);
  const currentMonthLabel = getMonthLabel(referenceDate, language);

  const archiveSummary = employee.weekHistory
    .filter((entry) => entry.monthKey === currentMonthKey)
    .reduce(
      (summary, entry) => ({
        totalHours: summary.totalHours + entry.totalHours,
        grossPay: summary.grossPay + entry.grossPay,
        advancesTotal: summary.advancesTotal + entry.advancesTotal,
        pendingPay: summary.pendingPay + entry.pendingPay,
      }),
      {
        totalHours: 0,
        grossPay: 0,
        advancesTotal: 0,
        pendingPay: 0,
      },
    );

  return {
    monthKey: currentMonthKey,
    monthLabel: currentMonthLabel,
    totalHours: archiveSummary.totalHours + getTotalHours(employee.workLog),
    grossPay: archiveSummary.grossPay + getGrossPay(employee),
    advancesTotal:
      archiveSummary.advancesTotal + getTotalAdvances(employee.advances),
    pendingPay: archiveSummary.pendingPay + getPendingPay(employee),
  };
}

export function hasCurrentWeekActivity(employee: Employee) {
  return (
    getTotalHours(employee.workLog) > 0 || getTotalAdvances(employee.advances) > 0
  );
}

export type FinanceEntryType = "income" | "expense";

export type FinanceCategory =
  | "salary"
  | "rent"
  | "materials"
  | "utilities"
  | "transport"
  | "taxes"
  | "other";

export type FinanceEntry = {
  id: string;
  entryDate: string; // "YYYY-MM-DD"
  entryType: FinanceEntryType;
  category: FinanceCategory | null;
  amount: number;
  description: string | null;
};

export type NewFinanceEntryInput = {
  entryDate: string;
  entryType: FinanceEntryType;
  category: FinanceCategory | null;
  amount: number;
  description: string;
};

export function getMonthKey(dateIso: string): string {
  return dateIso.slice(0, 7); // "YYYY-MM"
}

export function getEntriesForMonth(
  entries: FinanceEntry[],
  monthKey: string,
): FinanceEntry[] {
  return entries.filter((entry) => getMonthKey(entry.entryDate) === monthKey);
}

export function getMonthTotals(entries: FinanceEntry[]) {
  const income = entries
    .filter((entry) => entry.entryType === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const expense = entries
    .filter((entry) => entry.entryType === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

  return { income, expense, balance: income - expense };
}
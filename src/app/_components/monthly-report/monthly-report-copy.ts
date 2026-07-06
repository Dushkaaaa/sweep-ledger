import type { LanguageCode } from "../../_i18n/translations";

export const monthlyPdfCopy = {
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
  de: {
    title: "Monatsbericht",
    generatedAt: "Erstellt",
    employee: "Mitarbeiter",
    role: "Rolle",
    hourlyRate: "Satz",
    totalHours: "Stunden gesamt",
    grossPay: "Bruttolohn",
    advances: "Vorschüsse",
    pendingPay: "Ausstehende Zahlung",
    currentWeek: "Aktuelle offene Woche",
    closedWeeks: "Geschlossene Wochen dieses Monats",
    noHours: "Keine Stunden",
    noAdvances: "Keine Vorschüsse",
    issued: "Ausgezahlt",
    weekClosed: "Woche",
    summary: "Übersicht",
    saveHint: "Wähle im Druckdialog „Als PDF speichern”.",
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

export function getReportLocale(language: LanguageCode) {
  if (language === "uk") {
    return "uk-UA";
  }

  if (language === "de") {
    return "de-DE";
  }

  if (language === "pl") {
    return "pl-PL";
  }

  return "en-US";
}

export type MonthlyPdfLabels = (typeof monthlyPdfCopy)[LanguageCode];
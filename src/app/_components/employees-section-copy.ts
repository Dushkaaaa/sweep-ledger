import type { LanguageCode } from "../_i18n/translations";

export const trackerName = "Trackora";

export type CabinetSection =
  | "home"
  | "employees"
  | "weekly-report"
  | "monthly-report"
  | "settings";

export const cabinetCopy = {
  uk: {
    title: "Кабінет керування",
    description:
      "Обери розділ, з яким хочеш працювати зараз. Працівники, звіти й налаштування тепер розділені по окремих плитках.",
    backToMenu: "Назад до меню",
    menu: {
      home: "Головна",
      employees: "Працівники",
      weeklyReport: "Звіт за тиждень",
      monthlyReport: "Звіт за місяць",
      settings: "Налаштування",
      signOut: "Вихід з кабінету",
    },
    hints: {
      home: "Огляд кабінету",
      employees: "Список і картки команди",
      weeklyReport: "Години та виплати за тиждень",
      monthlyReport: "Зведення за поточний місяць",
      settings: "Мова та параметри кабінету",
      signOut: "Завершити сесію",
    },
    weeklyTitle: "Звіт за тиждень",
    monthlyTitle: "Звіт за місяць",
    settingsTitle: "Налаштування",
    weeklyDescription:
      "Коротке зведення по відкритому тижню. Детальні звіти можна розширити пізніше окремими таблицями.",
    monthlyDescription:
      "Поточний місячний підсумок по всіх працівниках з урахуванням закритих тижнів.",
    settingsDescription:
      "Базові налаштування кабінету. Зараз тут доступний вибір мови інтерфейсу.",
    employeesCount: "Працівників",
    activeWeekHours: "Годин за тиждень",
    pendingWeekPay: "До виплати за тиждень",
    activeMonthHours: "Годин за місяць",
    pendingMonthPay: "До виплати за місяць",
    downloadMonthlyPdf: "Завантажити PDF",
  },
  en: {
    title: "Workspace menu",
    description:
      "Choose the section you want to work with now. Employees, reports, and settings are split into separate tiles.",
    backToMenu: "Back to menu",
    menu: {
      home: "Home",
      employees: "Employees",
      weeklyReport: "Weekly report",
      monthlyReport: "Monthly report",
      settings: "Settings",
      signOut: "Sign out",
    },
    hints: {
      home: "Workspace overview",
      employees: "Team list and employee cards",
      weeklyReport: "Weekly hours and payouts",
      monthlyReport: "Current month summary",
      settings: "Language and workspace options",
      signOut: "End the session",
    },
    weeklyTitle: "Weekly report",
    monthlyTitle: "Monthly report",
    settingsTitle: "Settings",
    weeklyDescription:
      "A quick summary of the open week. Detailed report tables can be expanded later.",
    monthlyDescription:
      "Current monthly totals across all employees, including closed weeks.",
    settingsDescription:
      "Basic workspace settings. For now, language selection is available here.",
    employeesCount: "Employees",
    activeWeekHours: "Hours this week",
    pendingWeekPay: "Pending this week",
    activeMonthHours: "Hours this month",
    pendingMonthPay: "Pending this month",
    downloadMonthlyPdf: "Download PDF",
  },
  de: {
    title: "Arbeitsbereich-Menü",
    description:
      "Wähle den Bereich, mit dem du jetzt arbeiten möchtest. Mitarbeiter, Berichte und Einstellungen sind in separate Kacheln aufgeteilt.",
    backToMenu: "Zurück zum Menü",
    menu: {
      home: "Start",
      employees: "Mitarbeiter",
      weeklyReport: "Wochenbericht",
      monthlyReport: "Monatsbericht",
      settings: "Einstellungen",
      signOut: "Abmelden",
    },
    hints: {
      home: "Übersicht des Arbeitsbereichs",
      employees: "Teamliste und Mitarbeiterkarten",
      weeklyReport: "Wochenstunden und Auszahlungen",
      monthlyReport: "Übersicht des aktuellen Monats",
      settings: "Sprache und Optionen",
      signOut: "Sitzung beenden",
    },
    weeklyTitle: "Wochenbericht",
    monthlyTitle: "Monatsbericht",
    settingsTitle: "Einstellungen",
    weeklyDescription:
      "Eine kurze Übersicht über die offene Woche. Detaillierte Berichtstabellen können später erweitert werden.",
    monthlyDescription:
      "Aktuelle Monatssummen für alle Mitarbeiter, einschließlich geschlossener Wochen.",
    settingsDescription:
      "Grundeinstellungen des Arbeitsbereichs. Hier kannst du Sprache, Logo und Passwort verwalten.",
    employeesCount: "Mitarbeiter",
    activeWeekHours: "Stunden diese Woche",
    pendingWeekPay: "Ausstehend diese Woche",
    activeMonthHours: "Stunden diesen Monat",
    pendingMonthPay: "Ausstehend diesen Monat",
    downloadMonthlyPdf: "PDF herunterladen",
  },
  pl: {
    title: "Menu panelu",
    description:
      "Wybierz sekcję, z którą chcesz teraz pracować. Pracownicy, raporty i ustawienia są rozdzielone na osobne kafelki.",
    backToMenu: "Wróć do menu",
    menu: {
      home: "Główna",
      employees: "Pracownicy",
      weeklyReport: "Raport tygodniowy",
      monthlyReport: "Raport miesięczny",
      settings: "Ustawienia",
      signOut: "Wyjście z panelu",
    },
    hints: {
      home: "Przegląd panelu",
      employees: "Lista i karty zespołu",
      weeklyReport: "Godziny i wypłaty za tydzień",
      monthlyReport: "Podsumowanie bieżącego miesiąca",
      settings: "Język i opcje panelu",
      signOut: "Zakończ sesję",
    },
    weeklyTitle: "Raport tygodniowy",
    monthlyTitle: "Raport miesięczny",
    settingsTitle: "Ustawienia",
    weeklyDescription:
      "Krótkie podsumowanie otwartego tygodnia. Szczegółowe tabele raportów można rozbudować później.",
    monthlyDescription:
      "Bieżące miesięczne podsumowanie wszystkich pracowników z uwzględnieniem zamkniętych tygodni.",
    settingsDescription:
      "Podstawowe ustawienia panelu. Na razie dostępny jest wybór języka interfejsu.",
    employeesCount: "Pracowników",
    activeWeekHours: "Godzin w tygodniu",
    pendingWeekPay: "Do wypłaty za tydzień",
    activeMonthHours: "Godzin w miesiącu",
    pendingMonthPay: "Do wypłaty za miesiąc",
    downloadMonthlyPdf: "Pobierz PDF",
  },
} as const;

export type CabinetCopy = (typeof cabinetCopy)[LanguageCode];
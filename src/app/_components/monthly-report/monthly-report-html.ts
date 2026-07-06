import {
  type Employee,
  getCurrentMonthSummary,
  getMonthKey,
  getPendingPay,
  getWorkDayLabel,
  workDays,
} from "../../_data/employees";
import type { LanguageCode } from "../../_i18n/translations";
import { getReportLocale, monthlyPdfCopy, type MonthlyPdfLabels } from "./monthly-report-copy";

export function buildMonthlyReportHtml({
  companyName,
  employees,
  language,
  currency,
  hoursLabel,
}: {
  companyName: string;
  employees: Employee[];
  language: LanguageCode;
  currency: string;
  hoursLabel: string;
}) {
  const labels = monthlyPdfCopy[language];
  const now = new Date();
  const monthSummary = employees.reduce(
    (summary, employee) => {
      const employeeSummary = getCurrentMonthSummary(employee, now, language);

      return {
        monthLabel: employeeSummary.monthLabel,
        totalHours: summary.totalHours + employeeSummary.totalHours,
        grossPay: summary.grossPay + employeeSummary.grossPay,
        advancesTotal: summary.advancesTotal + employeeSummary.advancesTotal,
        pendingPay: summary.pendingPay + employeeSummary.pendingPay,
      };
    },
    {
      monthLabel: getCurrentMonthSummary(
        employees[0] ?? createReportFallbackEmployee(),
        now,
        language,
      ).monthLabel,
      totalHours: 0,
      grossPay: 0,
      advancesTotal: 0,
      pendingPay: 0,
    },
  );
  const generatedAt = new Intl.DateTimeFormat(
    getReportLocale(language),
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(now);

  const employeeSections = employees
    .map((employee) =>
      buildEmployeeMonthlySection({
        employee,
        language,
        currency,
        hoursLabel,
        labels,
        monthKey: getMonthKey(now),
      }),
    )
    .join("");

  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(labels.title)} - ${escapeHtml(companyName)}</title>
  <style>
    * { box-sizing: border-box; }
    @page { size: A4; margin: 0; }
    body {
      margin: 0;
      background: #e2e8f0;
      color: #0f172a;
      font-family: "Segoe UI", Arial, sans-serif;
      line-height: 1.45;
    }
    main {
      max-width: 1040px;
      margin: 0 auto;
      padding: 38px;
      background: #fff;
    }
    h1, h2, h3 { margin: 0; }
    h1 { font-size: 34px; line-height: 1.1; letter-spacing: 0; }
    h2 { font-size: 21px; margin-top: 30px; }
    h3 { font-size: 15px; margin-top: 20px; color: #0f172a; }
    p { margin: 0; }
    ul { margin: 0; padding-left: 18px; }
    li + li { margin-top: 3px; }
    .muted { color: #64748b; }
    .eyebrow {
      color: #0369a1;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .12em;
      text-transform: uppercase;
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-start;
      border-radius: 18px;
      background: linear-gradient(135deg, #0f172a 0%, #075985 62%, #0e7490 100%);
      color: #fff;
      padding: 28px;
      margin-bottom: 24px;
    }
    .header .muted,
    .header .eyebrow {
      color: rgba(255,255,255,.72);
    }
    .header h1 {
      margin-top: 8px;
    }
    .header-meta {
      min-width: 190px;
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 14px;
      background: rgba(255,255,255,.1);
      padding: 14px;
      text-align: right;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 14px 0 28px;
    }
    .stat {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      background: #f8fafc;
    }
    .stat span {
      display: block;
      color: #64748b;
      font-size: 12px;
      margin-bottom: 6px;
    }
    .stat strong { font-size: 19px; color: #0f172a; }
    .employee {
      break-inside: avoid;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 18px;
      margin-top: 20px;
      box-shadow: 0 16px 40px -34px rgba(15, 23, 42, .45);
    }
    .employee-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .rate-box {
      min-width: 150px;
      border-radius: 8px;
      background: #f1f5f9;
      padding: 10px 12px;
      text-align: right;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 9px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-size: 11px;
      text-transform: uppercase;
    }
    .hint {
      margin-top: 22px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      font-size: 12px;
      color: #64748b;
    }
    @media print {
      body { background: #fff; }
      main { max-width: none; padding: 0; }
      .hint { display: none; }
    }
  </style>
</head>
<body>
  <main>
    <section class="header">
      <div>
        <p class="eyebrow">Trackora</p>
        <h1>${escapeHtml(labels.title)}</h1>
        <p>${escapeHtml(companyName)} · ${escapeHtml(monthSummary.monthLabel)}</p>
      </div>
      <div class="header-meta">
        <p class="muted">${escapeHtml(labels.generatedAt)}</p>
        <strong>${escapeHtml(generatedAt)}</strong>
      </div>
    </section>

    <section>
      <h2>${escapeHtml(labels.summary)}</h2>
      <div class="summary">
        <div class="stat"><span>${escapeHtml(labels.totalHours)}</span><strong>${monthSummary.totalHours} ${escapeHtml(hoursLabel)}</strong></div>
        <div class="stat"><span>${escapeHtml(labels.grossPay)}</span><strong>${monthSummary.grossPay} ${escapeHtml(currency)}</strong></div>
        <div class="stat"><span>${escapeHtml(labels.advances)}</span><strong>${monthSummary.advancesTotal} ${escapeHtml(currency)}</strong></div>
        <div class="stat"><span>${escapeHtml(labels.pendingPay)}</span><strong>${monthSummary.pendingPay} ${escapeHtml(currency)}</strong></div>
      </div>
    </section>

    ${employeeSections}
    <p class="hint">${escapeHtml(labels.saveHint)}</p>
  </main>
</body>
</html>`;
}

function buildEmployeeMonthlySection({
  employee,
  language,
  currency,
  hoursLabel,
  labels,
  monthKey,
}: {
  employee: Employee;
  language: LanguageCode;
  currency: string;
  hoursLabel: string;
  labels: MonthlyPdfLabels;
  monthKey: string;
}) {
  const summary = getCurrentMonthSummary(employee, new Date(), language);
  const currentWeekRows = buildWorkLogRows(employee.workLog, language, hoursLabel);
  const currentAdvances = employee.advances
    .map(
      (advance) =>
        `<li>${escapeHtml(getWorkDayLabel(advance.day, language))}: ${advance.amount} ${escapeHtml(currency)}</li>`,
    )
    .join("");
  const closedWeeks = employee.weekHistory.filter(
    (entry) => entry.monthKey === monthKey,
  );
  const closedWeeksHtml =
    closedWeeks.length > 0
      ? closedWeeks
          .map((entry) => {
            const advances =
              entry.advances.length > 0
                ? `<ul>${entry.advances
                    .map(
                      (advance) =>
                        `<li>${escapeHtml(getWorkDayLabel(advance.day, language))}: ${advance.amount} ${escapeHtml(currency)}</li>`,
                    )
                    .join("")}</ul>`
                : escapeHtml(labels.noAdvances);

            return `<tr>
              <td>${escapeHtml(entry.weekLabel)}<br /><span class="muted">${escapeHtml(entry.closedAt)}</span></td>
              <td>${buildWorkLogRows(entry.workLog, language, hoursLabel)}</td>
              <td>${entry.totalHours} ${escapeHtml(hoursLabel)}</td>
              <td>${entry.grossPay} ${escapeHtml(currency)}</td>
              <td>${advances}</td>
              <td>${entry.pendingPay} ${escapeHtml(currency)}</td>
            </tr>`;
          })
          .join("")
      : `<tr><td colspan="6" class="muted">${escapeHtml(labels.noHours)}</td></tr>`;

  return `<section class="employee">
    <div class="employee-head">
      <div>
        <h2>${escapeHtml(employee.name)}</h2>
        <p class="muted">${escapeHtml(labels.role)}: ${escapeHtml(employee.role)}</p>
      </div>
      <div class="rate-box">
        <p class="muted">${escapeHtml(labels.hourlyRate)}</p>
        <strong>${employee.hourlyRate} ${escapeHtml(currency)}/${escapeHtml(hoursLabel)}</strong>
      </div>
    </div>

    <div class="summary">
      <div class="stat"><span>${escapeHtml(labels.totalHours)}</span><strong>${summary.totalHours} ${escapeHtml(hoursLabel)}</strong></div>
      <div class="stat"><span>${escapeHtml(labels.grossPay)}</span><strong>${summary.grossPay} ${escapeHtml(currency)}</strong></div>
      <div class="stat"><span>${escapeHtml(labels.advances)}</span><strong>${summary.advancesTotal} ${escapeHtml(currency)}</strong></div>
      <div class="stat"><span>${escapeHtml(labels.pendingPay)}</span><strong>${summary.pendingPay} ${escapeHtml(currency)}</strong></div>
    </div>

    <h3>${escapeHtml(labels.currentWeek)}</h3>
    <table>
      <thead>
        <tr>
          <th>${escapeHtml(labels.totalHours)}</th>
          <th>${escapeHtml(labels.advances)}</th>
          <th>${escapeHtml(labels.pendingPay)}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${currentWeekRows}</td>
          <td>${currentAdvances ? `<ul>${currentAdvances}</ul>` : escapeHtml(labels.noAdvances)}</td>
          <td>${getPendingPay(employee)} ${escapeHtml(currency)}</td>
        </tr>
      </tbody>
    </table>

    <h3>${escapeHtml(labels.closedWeeks)}</h3>
    <table>
      <thead>
        <tr>
          <th>${escapeHtml(labels.weekClosed)}</th>
          <th>${escapeHtml(labels.totalHours)}</th>
          <th>${escapeHtml(labels.totalHours)}</th>
          <th>${escapeHtml(labels.grossPay)}</th>
          <th>${escapeHtml(labels.advances)}</th>
          <th>${escapeHtml(labels.pendingPay)}</th>
        </tr>
      </thead>
      <tbody>${closedWeeksHtml}</tbody>
    </table>
  </section>`;
}

function buildWorkLogRows(
  workLog: Employee["workLog"],
  language: LanguageCode,
  hoursLabel: string,
) {
  const rows = workDays
    .filter((day) => workLog[day.key] > 0)
    .map(
      (day) =>
        `<li>${escapeHtml(getWorkDayLabel(day.key, language))}: ${workLog[day.key]} ${escapeHtml(hoursLabel)}</li>`,
    )
    .join("");

  return rows ? `<ul>${rows}</ul>` : escapeHtml(monthlyPdfCopy[language].noHours);
}

export function createReportFallbackEmployee(): Employee {
  return {
    id: "fallback",
    name: "",
    role: "",
    hourlyRate: 0,
    status: "active",
    currentWeekId: null,
    currentWeekStartDate: null,
    workLog: {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    },
    advances: [],
    weekHistory: [],
  };
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
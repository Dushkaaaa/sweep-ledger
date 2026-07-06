import type { Employee } from "../_data/employees";
import type { LanguageCode } from "../_i18n/translations";
import { buildMonthlyReportHtml } from "./monthly-report/monthly-report-html";
import {
  renderMonthlyReportCanvas,
  renderReportHtmlToCanvas,
} from "./monthly-report/monthly-report-canvas";
import { createPdfBlobFromCanvas, downloadBlob } from "./monthly-report/pdf-blob";
import { getMonthKey } from "../_data/employees";

export async function downloadMonthlyReportPdf({
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
  const reportHtml = buildMonthlyReportHtml({
    companyName,
    employees,
    language,
    currency,
    hoursLabel,
  });

  const monthKey = getMonthKey(new Date());
  const fileName = `trackora-${sanitizeFileName(companyName)}-${monthKey}.pdf`;

  try {
    const reportCanvas = await renderReportHtmlToCanvas(reportHtml);
    const pdfBlob = await createPdfBlobFromCanvas(reportCanvas);

    downloadBlob(pdfBlob, fileName);
  } catch (error) {
    console.warn("Falling back to canvas rendering for the monthly PDF report.", error);

    const reportCanvas = renderMonthlyReportCanvas({
      companyName,
      employees,
      language,
      currency,
      hoursLabel,
    });
    const pdfBlob = await createPdfBlobFromCanvas(reportCanvas);

    downloadBlob(pdfBlob, fileName);
  }
}

function sanitizeFileName(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїєґąćęłńóśźż_-]+/gi, "-")
      .replace(/^-+|-+$/g, "") || "report"
  );
}

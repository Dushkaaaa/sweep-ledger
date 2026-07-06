import {
  type Employee,
  getCurrentMonthSummary,
  getMonthKey,
  getPendingPay,
  getWorkDayLabel,
  workDays,
} from "../../_data/employees";
import type { LanguageCode } from "../../_i18n/translations";
import { createReportFallbackEmployee } from "./monthly-report-html";
import { getReportLocale, monthlyPdfCopy } from "./monthly-report-copy";

export async function renderReportHtmlToCanvas(html: string) {
  const width = 1240;
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const mainMatch = html.match(/<main>([\s\S]*?)<\/main>/);
  const style = styleMatch?.[1] ?? "";
  const main = mainMatch?.[1] ?? "";
  const wrapper = document.createElement("div");

  wrapper.style.position = "fixed";
  wrapper.style.left = "-10000px";
  wrapper.style.top = "0";
  wrapper.style.width = `${width}px`;
  wrapper.style.background = "#ffffff";
  wrapper.innerHTML = `<style>${style}</style><main>${main}</main>`;
  document.body.appendChild(wrapper);

  const height = Math.max(wrapper.scrollHeight, 1754);
  const xhtmlMain = normalizeSvgXhtml(main);
  const xhtml = `<div xmlns="http://www.w3.org/1999/xhtml"><style>${style}
    body { margin: 0; background: #fff; }
    main { width: ${width}px; max-width: none; min-height: ${height}px; }
  </style><main>${xhtmlMain}</main></div>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%">${xhtml}</foreignObject></svg>`;
  const svgUrl = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );

  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    if (!context) {
      throw new Error("Canvas is not available for PDF generation.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0);

    return canvas;
  } finally {
    URL.revokeObjectURL(svgUrl);
    wrapper.remove();
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not render report image."));
    image.src = src;
  });
}

function normalizeSvgXhtml(html: string) {
  return html
    .replaceAll("<br>", "<br />")
    .replaceAll("<hr>", "<hr />")
    .replaceAll("&nbsp;", "&#160;");
}

export function renderMonthlyReportCanvas({
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
  const locale = getReportLocale(language);
  const monthKey = getMonthKey(now);
  const monthLabel = getCurrentMonthSummary(
    employees[0] ?? createReportFallbackEmployee(),
    now,
    language,
  ).monthLabel;
  const generatedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(now);
  const totalSummary = employees.reduce(
    (summary, employee) => {
      const employeeSummary = getCurrentMonthSummary(employee, now, language);

      return {
        totalHours: summary.totalHours + employeeSummary.totalHours,
        grossPay: summary.grossPay + employeeSummary.grossPay,
        advancesTotal: summary.advancesTotal + employeeSummary.advancesTotal,
        pendingPay: summary.pendingPay + employeeSummary.pendingPay,
      };
    },
    {
      totalHours: 0,
      grossPay: 0,
      advancesTotal: 0,
      pendingPay: 0,
    },
  );
  const estimatedHeight =
    620 +
    employees.reduce((height, employee) => {
      const closedWeeks = employee.weekHistory.filter(
        (entry) => entry.monthKey === monthKey,
      );

      return height + 520 + closedWeeks.length * 120;
    }, 0);
  const width = 1240;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = Math.max(1754, estimatedHeight);

  if (!context) {
    throw new Error("Canvas is not available for PDF generation.");
  }

  const left = 56;
  const contentWidth = width - left * 2;
  let y = 56;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const headerGradient = context.createLinearGradient(left, y, width - left, y + 220);

  headerGradient.addColorStop(0, "#0f172a");
  headerGradient.addColorStop(0.62, "#075985");
  headerGradient.addColorStop(1, "#0e7490");
  drawRoundRect(context, left, y, contentWidth, 220, 22, headerGradient);

  context.fillStyle = "rgba(255,255,255,.72)";
  drawCanvasText(context, "Trackora", left + 32, y + 42, 18, 760, 24, true);
  context.fillStyle = "#ffffff";
  drawCanvasText(context, labels.title, left + 32, y + 86, 44, 650, 54, true);
  context.fillStyle = "rgba(255,255,255,.86)";
  drawCanvasText(
    context,
    `${companyName} - ${monthLabel}`,
    left + 32,
    y + 150,
    21,
    650,
    30,
  );

  drawRoundRect(
    context,
    width - left - 280,
    y + 42,
    240,
    112,
    16,
    "rgba(255,255,255,.12)",
    "rgba(255,255,255,.22)",
  );
  context.fillStyle = "rgba(255,255,255,.72)";
  drawCanvasText(context, labels.generatedAt, width - left - 252, y + 76, 16, 190, 22);
  context.fillStyle = "#ffffff";
  drawCanvasText(context, generatedAt, width - left - 252, y + 112, 20, 190, 28, true);

  y += 260;
  context.fillStyle = "#0f172a";
  drawCanvasText(context, labels.summary, left, y, 28, contentWidth, 34, true);
  y += 52;
  drawCanvasStatRow(context, left, y, contentWidth, [
    [labels.totalHours, `${totalSummary.totalHours} ${hoursLabel}`],
    [labels.grossPay, `${totalSummary.grossPay} ${currency}`],
    [labels.advances, `${totalSummary.advancesTotal} ${currency}`],
    [labels.pendingPay, `${totalSummary.pendingPay} ${currency}`],
  ]);
  y += 132;

  employees.forEach((employee) => {
    const summary = getCurrentMonthSummary(employee, now, language);
    const closedWeeks = employee.weekHistory.filter(
      (entry) => entry.monthKey === monthKey,
    );
    const cardStartY = y;

    drawRoundRect(context, left, y, contentWidth, 1, 10, "#ffffff");
    y += 26;
    context.fillStyle = "#0f172a";
    drawCanvasText(context, employee.name, left + 24, y, 30, 620, 38, true);
    context.fillStyle = "#64748b";
    drawCanvasText(
      context,
      `${labels.role}: ${employee.role}`,
      left + 24,
      y + 42,
      17,
      620,
      24,
    );
    drawRoundRect(context, width - left - 240, y - 4, 216, 72, 10, "#f1f5f9");
    context.fillStyle = "#64748b";
    drawCanvasText(context, labels.hourlyRate, width - left - 218, y + 20, 15, 170, 20);
    context.fillStyle = "#0f172a";
    drawCanvasText(
      context,
      `${employee.hourlyRate} ${currency}/${hoursLabel}`,
      width - left - 218,
      y + 48,
      20,
      170,
      24,
      true,
    );

    y += 104;
    drawCanvasStatRow(context, left + 24, y, contentWidth - 48, [
      [labels.totalHours, `${summary.totalHours} ${hoursLabel}`],
      [labels.grossPay, `${summary.grossPay} ${currency}`],
      [labels.advances, `${summary.advancesTotal} ${currency}`],
      [labels.pendingPay, `${summary.pendingPay} ${currency}`],
    ]);
    y += 130;

    y = drawCanvasSectionList(
      context,
      left + 24,
      y,
      contentWidth - 48,
      labels.currentWeek,
      [
        `${labels.totalHours}: ${formatWorkLogText(employee.workLog, language, hoursLabel, labels.noHours)}`,
        `${labels.advances}: ${formatAdvancesText(employee.advances, language, currency, labels.noAdvances)}`,
        `${labels.pendingPay}: ${getPendingPay(employee)} ${currency}`,
      ],
    );

    y = drawCanvasSectionList(
      context,
      left + 24,
      y + 8,
      contentWidth - 48,
      labels.closedWeeks,
      closedWeeks.length > 0
        ? closedWeeks.flatMap((entry) => [
            `${labels.weekClosed}: ${entry.weekLabel} (${entry.closedAt})`,
            `${labels.totalHours}: ${formatWorkLogText(entry.workLog, language, hoursLabel, labels.noHours)}`,
            `${labels.grossPay}: ${entry.grossPay} ${currency}`,
            `${labels.advances}: ${formatAdvancesText(entry.advances, language, currency, labels.noAdvances)}`,
            `${labels.pendingPay}: ${entry.pendingPay} ${currency}`,
          ])
        : [labels.noHours],
    );

    drawRoundRect(
      context,
      left,
      cardStartY,
      contentWidth,
      y - cardStartY + 22,
      14,
      "transparent",
      "#cbd5e1",
    );
    y += 54;
  });

  return trimCanvas(canvas, Math.ceil(y + 56));
}

function drawRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string | CanvasGradient,
  stroke?: string,
) {
  context.save();
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();

  if (fill !== "transparent") {
    context.fillStyle = fill;
    context.fill();
  }

  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = 1.5;
    context.stroke();
  }

  context.restore();
}

function drawCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  maxWidth: number,
  lineHeight: number,
  bold = false,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  context.font = `${bold ? "700" : "400"} ${size}px "Segoe UI", Arial, sans-serif`;

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (context.measureText(nextLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });

  return Math.max(lineHeight, lines.length * lineHeight);
}

function drawCanvasStatRow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  stats: Array<[string, string]>,
) {
  const gap = 16;
  const statWidth = (width - gap * (stats.length - 1)) / stats.length;

  stats.forEach(([label, value], index) => {
    const statX = x + index * (statWidth + gap);

    drawRoundRect(context, statX, y, statWidth, 96, 10, "#f8fafc", "#e2e8f0");
    context.fillStyle = "#64748b";
    drawCanvasText(context, label, statX + 16, y + 30, 15, statWidth - 32, 20);
    context.fillStyle = "#0f172a";
    drawCanvasText(context, value, statX + 16, y + 66, 24, statWidth - 32, 28, true);
  });
}

function drawCanvasSectionList(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  title: string,
  rows: string[],
) {
  context.fillStyle = "#0f172a";
  drawCanvasText(context, title, x, y, 20, width, 26, true);
  y += 36;

  rows.forEach((row) => {
    drawRoundRect(context, x, y, width, 1, 0, "#e2e8f0");
    context.fillStyle = "#334155";
    const rowHeight = drawCanvasText(context, row, x + 12, y + 26, 17, width - 24, 24);

    y += Math.max(46, rowHeight + 20);
  });

  return y + 10;
}

function formatWorkLogText(
  workLog: Employee["workLog"],
  language: LanguageCode,
  hoursLabel: string,
  emptyLabel: string,
) {
  const rows = workDays
    .filter((day) => workLog[day.key] > 0)
    .map(
      (day) =>
        `${getWorkDayLabel(day.key, language)}: ${workLog[day.key]} ${hoursLabel}`,
    );

  return rows.length > 0 ? rows.join("; ") : emptyLabel;
}

function formatAdvancesText(
  advances: Employee["advances"],
  language: LanguageCode,
  currency: string,
  emptyLabel: string,
) {
  const rows = advances.map(
    (advance) =>
      `${getWorkDayLabel(advance.day, language)}: ${advance.amount} ${currency}`,
  );

  return rows.length > 0 ? rows.join("; ") : emptyLabel;
}

function trimCanvas(canvas: HTMLCanvasElement, height: number) {
  const trimmedCanvas = document.createElement("canvas");
  const context = trimmedCanvas.getContext("2d");

  trimmedCanvas.width = canvas.width;
  trimmedCanvas.height = Math.min(canvas.height, Math.max(1, height));

  if (!context) {
    throw new Error("Canvas is not available for PDF generation.");
  }

  context.drawImage(
    canvas,
    0,
    0,
    trimmedCanvas.width,
    trimmedCanvas.height,
    0,
    0,
    trimmedCanvas.width,
    trimmedCanvas.height,
  );

  return trimmedCanvas;
}
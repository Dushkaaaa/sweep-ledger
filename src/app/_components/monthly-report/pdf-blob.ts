export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function createPdfBlobFromCanvas(canvas: HTMLCanvasElement) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const pagePixelHeight = Math.floor((canvas.width * pageHeight) / pageWidth);
  const pages: Array<{
    imageBytes: Uint8Array;
    width: number;
    height: number;
    renderHeight: number;
  }> = [];

  for (let y = 0; y < canvas.height; y += pagePixelHeight) {
    const sliceHeight = Math.min(pagePixelHeight, canvas.height - y);
    const pageCanvas = document.createElement("canvas");
    const pageContext = pageCanvas.getContext("2d");

    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    if (!pageContext) {
      throw new Error("Canvas is not available for PDF generation.");
    }

    pageContext.fillStyle = "#ffffff";
    pageContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    pageContext.drawImage(
      canvas,
      0,
      y,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight,
    );

    pages.push({
      imageBytes: dataUrlToBytes(pageCanvas.toDataURL("image/jpeg", 0.92)),
      width: pageCanvas.width,
      height: pageCanvas.height,
      renderHeight: pageHeight * (sliceHeight / pagePixelHeight),
    });
  }

  return buildPdfFromJpegPages(pages, pageWidth, pageHeight);
}

function buildPdfFromJpegPages(
  pages: Array<{
    imageBytes: Uint8Array;
    width: number;
    height: number;
    renderHeight: number;
  }>,
  pageWidth: number,
  pageHeight: number,
) {
  const encoder = new TextEncoder();
  const chunks: BlobPart[] = [];
  const offsets: number[] = [0];
  let byteLength = 0;

  function push(chunk: string | Uint8Array) {
    if (typeof chunk === "string") {
      chunks.push(chunk);
    } else {
      const buffer = new ArrayBuffer(chunk.byteLength);
      const view = new Uint8Array(buffer);

      view.set(chunk);
      chunks.push(buffer);
    }

    byteLength += typeof chunk === "string" ? encoder.encode(chunk).length : chunk.length;
  }

  function beginObject(id: number) {
    offsets[id] = byteLength;
    push(`${id} 0 obj\n`);
  }

  const pageRefs = pages
    .map((_, index) => `${3 + index * 3} 0 R`)
    .join(" ");

  push("%PDF-1.4\n");
  beginObject(1);
  push("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  beginObject(2);
  push(`<< /Type /Pages /Kids [${pageRefs}] /Count ${pages.length} >>\nendobj\n`);

  pages.forEach((page, index) => {
    const pageObject = 3 + index * 3;
    const imageObject = pageObject + 1;
    const contentObject = pageObject + 2;
    const yOffset = pageHeight - page.renderHeight;
    const content = `q\n${pageWidth} 0 0 ${page.renderHeight.toFixed(2)} 0 ${yOffset.toFixed(2)} cm\n/Im${index} Do\nQ\n`;

    beginObject(pageObject);
    push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im${index} ${imageObject} 0 R >> >> /Contents ${contentObject} 0 R >>\nendobj\n`,
    );

    beginObject(imageObject);
    push(
      `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.imageBytes.length} >>\nstream\n`,
    );
    push(page.imageBytes);
    push("\nendstream\nendobj\n");

    beginObject(contentObject);
    push(`<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream\nendobj\n`);
  });

  const xrefOffset = byteLength;
  const objectCount = 3 + pages.length * 3;

  push(`xref\n0 ${objectCount}\n`);
  push("0000000000 65535 f \n");

  for (let id = 1; id < objectCount; id += 1) {
    push(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  }

  push(
    `trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
  );

  return new Blob(chunks, { type: "application/pdf" });
}

function dataUrlToBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}
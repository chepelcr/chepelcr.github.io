import type jsPDF from 'jspdf';

/** Palette shared by every generated CV. */
export const PDF_COLORS = {
  primary: '#1e3a8a',
  text: '#374151',
  light: '#6b7280',
  accent: '#1e3a8a',
} as const;

export interface PdfLayout {
  doc: jsPDF;
  margin: number;
  contentWidth: number;
  pageWidth: number;
  pageHeight: number;
  bottomMargin: number;
  /** Current vertical cursor, in mm from the top of the page. */
  y: number;
  checkPageBreak: (additionalSpace?: number) => boolean;
  addSectionTitle: (title: string) => void;
  addParagraph: (
    text: string,
    fontSize?: number,
    color?: string,
    isBold?: boolean,
    justify?: boolean
  ) => void;
  addLabelValue: (label: string, value: string, labelWidth?: number) => void;
  addBullet: (text: string) => void;
  measureBulletHeight: (text: string) => number;
  /** Centered "<name> — CV | Page i/n" footer stamped on every page. */
  addPageFooters: (label: string) => void;
}

/**
 * Builds the shared page-layout helpers (page breaks, section titles, paragraphs,
 * label/value rows and bullets) over a jsPDF document, tracking a single vertical
 * cursor. Used by both the full technical CV and the simplified CV generators.
 */
export function createPdfLayout(doc: jsPDF): PdfLayout {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 18;
  const contentWidth = pageWidth - 2 * margin;
  const bottomMargin = 18;
  let yPosition = 18;

  const { text: textColor, light: lightTextColor, accent: accentColor } = PDF_COLORS;

  const checkPageBreak = (additionalSpace: number = 12) => {
    if (yPosition + additionalSpace > pageHeight - bottomMargin) {
      doc.addPage();
      yPosition = 18;
      return true;
    }
    return false;
  };

  const addSectionTitle = (title: string) => {
    checkPageBreak(18);
    doc.setFontSize(14);
    doc.setTextColor(accentColor);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, yPosition);
    yPosition += 2;
    doc.setDrawColor(accentColor);
    doc.setLineWidth(0.4);
    doc.line(margin, yPosition, margin + contentWidth, yPosition);
    yPosition += 6;
  };

  const addParagraph = (
    text: string,
    fontSize = 10,
    color: string = textColor,
    isBold = false,
    justify = false
  ) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lineHeight = fontSize * 0.5;
    const lines: string[] = doc.splitTextToSize(text, contentWidth);
    lines.forEach((line: string, idx: number) => {
      checkPageBreak(lineHeight + 2);
      if (justify && idx < lines.length - 1 && line.trim().split(' ').length > 1) {
        const words = line.trim().split(' ');
        const textW = words.reduce((s, w) => s + doc.getTextWidth(w), 0);
        const gap = (contentWidth - textW) / (words.length - 1);
        let x = margin;
        words.forEach((w, i) => {
          doc.text(w, x, yPosition);
          x += doc.getTextWidth(w) + (i < words.length - 1 ? gap : 0);
        });
      } else {
        doc.text(line, margin, yPosition);
      }
      yPosition += lineHeight;
    });
    yPosition += 2;
  };

  const addLabelValue = (label: string, value: string, labelWidth = 50) => {
    const fontSize = 10;
    const lineHeight = fontSize * 0.5;
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text(label, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightTextColor);
    const valueX = margin + labelWidth;
    const valueWidth = contentWidth - labelWidth;
    const lines: string[] = doc.splitTextToSize(value, valueWidth);
    const startY = yPosition;
    lines.forEach((line: string, idx: number) => {
      doc.text(line, valueX, startY + idx * lineHeight);
    });
    yPosition = startY + lines.length * lineHeight + 2;
    checkPageBreak(4);
  };

  const addBullet = (text: string) => {
    const fontSize = 10;
    const lineHeight = fontSize * 0.5;
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor);
    const indent = 5;
    const bulletX = margin + indent;
    const textX = margin + indent + 4;
    const lines: string[] = doc.splitTextToSize(text, contentWidth - indent - 4);
    checkPageBreak(lines.length * lineHeight + 2);
    doc.text('•', bulletX, yPosition);
    lines.forEach((line: string, idx: number) => {
      doc.text(line, textX, yPosition + idx * lineHeight);
    });
    yPosition += lines.length * lineHeight + 0.8;
  };

  const measureBulletHeight = (text: string): number => {
    const fontSize = 10;
    const lineHeight = fontSize * 0.5;
    const indent = 5;
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');
    const lines: string[] = doc.splitTextToSize(text, contentWidth - indent - 4);
    return lines.length * lineHeight + 0.8;
  };

  const addPageFooters = (label: string) => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(lightTextColor);
      doc.setFont('helvetica', 'normal');
      doc.text(`${label} ${i}/${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    }
  };

  return {
    doc,
    margin,
    contentWidth,
    pageWidth,
    pageHeight,
    bottomMargin,
    get y() {
      return yPosition;
    },
    set y(value: number) {
      yPosition = value;
    },
    checkPageBreak,
    addSectionTitle,
    addParagraph,
    addLabelValue,
    addBullet,
    measureBulletHeight,
    addPageFooters,
  };
}

/**
 * Renders bullets from a `\n`-separated description, page-breaking one bullet early
 * when the last bullet would otherwise land alone on a fresh page (widow control).
 */
export function addBulletsWithWidowControl(layout: PdfLayout, bullets: string[]) {
  bullets.forEach((bullet, index) => {
    const height = layout.measureBulletHeight(bullet);
    const isSecondToLast = index === bullets.length - 2;

    if (isSecondToLast && bullets.length >= 2) {
      const lastHeight = layout.measureBulletHeight(bullets[bullets.length - 1]);
      const limit = layout.pageHeight - layout.bottomMargin;
      if (layout.y + height + lastHeight > limit && layout.y + height <= limit) {
        layout.doc.addPage();
        layout.y = 18;
      }
    }

    layout.addBullet(bullet);
  });
}

/** Splits a `\n`-separated description field into trimmed, non-empty bullet lines. */
export function toBullets(description: string): string[] {
  return description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

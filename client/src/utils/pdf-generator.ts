import jsPDF from 'jspdf';
import { CVData } from '@/contexts/language-context';
import { getCvSkillGroups } from '@/services/cv.service';
import { formatPhoneDisplay } from '@/lib/phone';

export function generatePDF(data: CVData, language: 'es' | 'en', t: (key: string) => string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 18;
  const contentWidth = pageWidth - 2 * margin;
  const bottomMargin = 18;
  let yPosition = 18;

  const primaryColor = '#1e3a8a';
  const textColor = '#374151';
  const lightTextColor = '#6b7280';
  const accentColor = '#1e3a8a';

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

  const addParagraph = (text: string, fontSize = 10, color = textColor, isBold = false, justify = false) => {
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

  // ─── Header ──────────────────────────────────────────────────────
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text(data.personalInfo.name, margin, yPosition);
  yPosition += 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor);
  doc.text(data.personalInfo.title, margin, yPosition);
  yPosition += 7;

  // Contact block
  doc.setFontSize(9);
  doc.setTextColor(lightTextColor);
  const contactLine = [
    data.personalInfo.email,
    formatPhoneDisplay(data.personalInfo.phone),
    data.personalInfo.location,
    data.personalInfo.languages,
  ].join('   |   ');
  const contactLines: string[] = doc.splitTextToSize(contactLine, contentWidth);
  contactLines.forEach((line: string) => {
    doc.text(line, margin, yPosition);
    yPosition += 4.5;
  });
  yPosition += 3;

  // ─── Profile paragraph (with ATS-friendly heading, left-aligned) ─
  addSectionTitle(t('cv.summary'));
  addParagraph(data.about, 10, textColor, false, false);
  yPosition += 2;

  // ─── Technical Skills (label/value rows) ─────────────────────────
  addSectionTitle(t('skills.title'));

  getCvSkillGroups(t).forEach((group) => {
    addLabelValue(`${group.label}:`, group.items.join(', '));
  });
  yPosition += 2;

  // ─── Work Experience ─────────────────────────────────────────────
  addSectionTitle(t('experience.title'));

  const techLabel = `${t('cv.techLabel')}:`;
  const respLabel = `${t('cv.respLabel')}:`;

  data.experience.forEach((company) => {
    const visibleRoles = company.roles.filter((r) => !r.hideFromPdf);
    visibleRoles.forEach((role, idx) => {
      checkPageBreak(28);

      // Role line: "Title – Company"
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textColor);
      doc.text(`${role.title} – ${company.company}`, margin, yPosition);
      yPosition += 5;

      // Period
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(lightTextColor);
      doc.text(role.period, margin, yPosition);
      yPosition += 5;

      // Technologies (only once per company, with first visible role)
      if (idx === 0 && company.skills.length > 0) {
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textColor);
        const techPrefix = `${techLabel} `;
        const techPrefixWidth = doc.getTextWidth(techPrefix);
        doc.text(techPrefix, margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(lightTextColor);
        const techText = company.skills.join(', ');
        const techLines: string[] = doc.splitTextToSize(techText, contentWidth - techPrefixWidth);
        techLines.forEach((line: string, lineIdx: number) => {
          if (lineIdx === 0) {
            doc.text(line, margin + techPrefixWidth, yPosition);
          } else {
            yPosition += 4.5;
            doc.text(line, margin, yPosition);
          }
        });
        yPosition += 5;
      }

      // Responsibilities
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textColor);
      doc.text(respLabel, margin, yPosition);
      yPosition += 3.5;

      const bullets = role.description.split('\n').map((b) => b.trim()).filter(Boolean);

      // Widow control: render bullets, but if only the last bullet would land alone
      // on a new page, page-break one bullet earlier so at least 2 stay together.
      bullets.forEach((b, bIdx) => {
        const h = measureBulletHeight(b);
        const isLast = bIdx === bullets.length - 1;
        const isSecondToLast = bIdx === bullets.length - 2;

        if (isSecondToLast && bullets.length >= 2) {
          const lastH = measureBulletHeight(bullets[bullets.length - 1]);
          if (yPosition + h + lastH > pageHeight - bottomMargin && yPosition + h <= pageHeight - bottomMargin) {
            doc.addPage();
            yPosition = 18;
          }
        }

        if (isLast && yPosition + h > pageHeight - bottomMargin && yPosition < 30) {
          // Last bullet alone at top of new page — keep with role by ensuring it doesn't orphan
          // (already handled above, just render)
        }

        addBullet(b);
      });
      yPosition += 2;
    });
  });

  // ─── Education ───────────────────────────────────────────────────
  addSectionTitle(t('education.educationSubtitle'));
  data.education.forEach((edu) => {
    checkPageBreak(14);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text(edu.degree, margin, yPosition);
    yPosition += 5;
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightTextColor);
    doc.text(`${edu.institution} — ${edu.period}`, margin, yPosition);
    yPosition += 6;
  });

  // ─── Continuing Education ────────────────────────────────────────
  addSectionTitle(t('education.trainingSubtitle'));

  const groups: { [key: string]: typeof data.additionalTraining } = {};
  data.additionalTraining.forEach((tr) => {
    if (!groups[tr.institution]) groups[tr.institution] = [];
    groups[tr.institution].push(tr);
  });
  Object.entries(groups).forEach(([institution, items]) => {
    checkPageBreak(12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text(institution, margin, yPosition);
    yPosition += 5;
    items.forEach((item) => addBullet(item.name));
    yPosition += 2;
  });

  // ─── Certifications ──────────────────────────────────────────────
  // Keep all certs together: if they won't all fit on the current page,
  // start them on a new page.
  const certsTotalHeight = data.certifications.reduce(
    (sum, cert) => sum + measureBulletHeight(cert.name),
    18 // section title height
  );
  if (yPosition + certsTotalHeight > pageHeight - bottomMargin) {
    doc.addPage();
    yPosition = 18;
  }
  addSectionTitle(t('education.certificationsSubtitle'));
  data.certifications.forEach((cert) => {
    addBullet(cert.name);
  });

  // ─── Footer ──────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(lightTextColor);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${data.personalInfo.name} — CV  |  ${t('cv.page')} ${i}/${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  return doc;
}

export function downloadCV(cvData: CVData, language: 'es' | 'en', t: (key: string) => string) {
  if (!cvData || !cvData.personalInfo) {
    console.error('CV data is not available yet');
    return;
  }
  const pdf = generatePDF(cvData, language, t);
  const fileName = `Jose_Pablo_Campos_CV_${language.toUpperCase()}_${new Date().getFullYear()}.pdf`;
  pdf.save(fileName);
}

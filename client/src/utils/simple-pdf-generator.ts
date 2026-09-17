import jsPDF from 'jspdf';
import type { SimpleCVData } from '@/services/simple-cv.service';
import { formatPhoneDisplay } from '@/lib/phone';
import {
  PDF_COLORS,
  createPdfLayout,
  addBulletsWithWidowControl,
  toBullets,
} from '@/utils/pdf-layout';

/**
 * Renders the simplified, non-technical CV: plain-language responsibilities, a single
 * tools line and personal skills in place of the technical skill matrix, and no
 * per-company technology lists or projects section.
 */
export function generateSimplePDF(data: SimpleCVData, t: (key: string) => string) {
  const doc = new jsPDF();
  const L = createPdfLayout(doc);
  const { margin, contentWidth, pageHeight, bottomMargin } = L;

  const { primary: primaryColor, text: textColor, light: lightTextColor } = PDF_COLORS;

  // ─── Header ──────────────────────────────────────────────────────
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text(data.personalInfo.name, margin, L.y);
  L.y += 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor);
  doc.text(data.personalInfo.title, margin, L.y);
  L.y += 7;

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
    doc.text(line, margin, L.y);
    L.y += 4.5;
  });
  L.y += 3;

  // ─── Professional summary (justified) ────────────────────────────
  L.addSectionTitle(t('cv.summary'));
  L.addParagraph(data.summary, 10, textColor, false, true);
  L.y += 2;

  // ─── Tools & skills (single condensed, justified line) ───────────
  if (data.toolsLine) {
    L.addSectionTitle(t('simpleCv.toolsLabel'));
    L.addParagraph(data.toolsLine, 10, textColor, false, true);
    L.y += 2;
  }

  // ─── Personal skills ─────────────────────────────────────────────
  if (data.softSkills.length > 0) {
    L.addSectionTitle(t('simpleCv.softSkillsLabel'));
    data.softSkills.forEach((skill) => L.addBullet(skill));
    L.y += 2;
  }

  // ─── Work experience (no technology lists) ───────────────────────
  L.addSectionTitle(t('experience.title'));

  const respLabel = `${t('cv.respLabel')}:`;

  data.experience.forEach((position) => {
    const bullets = toBullets(position.description);

    // Keep each job whole: title, period, label and every bullet stay on one page.
    // Only move it down if it actually fits on a fresh page, so an unusually long
    // job still renders (flowing across pages) instead of pushing forever.
    const headerHeight = 5 + 5 + 3.5;
    const positionHeight =
      headerHeight + bullets.reduce((sum, b) => sum + L.measureBulletHeight(b), 0) + 2;
    const usableHeight = pageHeight - bottomMargin - 18;

    if (L.y + positionHeight > pageHeight - bottomMargin && positionHeight <= usableHeight) {
      doc.addPage();
      L.y = 18;
    } else {
      L.checkPageBreak(28);
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text(`${position.title} – ${position.company}`, margin, L.y);
    L.y += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(lightTextColor);
    doc.text(position.period, margin, L.y);
    L.y += 5;

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text(respLabel, margin, L.y);
    L.y += 3.5;

    addBulletsWithWidowControl(L, bullets);
    L.y += 2;
  });

  // ─── Education ───────────────────────────────────────────────────
  L.addSectionTitle(t('education.educationSubtitle'));
  data.education.forEach((edu) => {
    L.checkPageBreak(14);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text(edu.degree, margin, L.y);
    L.y += 5;
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightTextColor);
    doc.text(`${edu.institution} — ${edu.period}`, margin, L.y);
    L.y += 6;
  });

  // ─── Certifications (kept together on one page when possible) ────
  if (data.certifications.length > 0) {
    const certsTotalHeight = data.certifications.reduce(
      (sum, cert) => sum + L.measureBulletHeight(cert.name),
      18 // section title height
    );
    if (L.y + certsTotalHeight > pageHeight - bottomMargin) {
      doc.addPage();
      L.y = 18;
    }
    L.addSectionTitle(t('education.certificationsSubtitle'));
    data.certifications.forEach((cert) => L.addBullet(cert.name));
    L.y += 2;
  }

  // ─── Additional training, grouped by institution ─────────────────
  if (data.additionalTraining.length > 0) {
    L.addSectionTitle(t('education.trainingSubtitle'));

    const groups: { [institution: string]: string[] } = {};
    data.additionalTraining.forEach((item) => {
      if (!groups[item.institution]) groups[item.institution] = [];
      groups[item.institution].push(item.name);
    });
    Object.entries(groups).forEach(([institution, courses]) => {
      L.checkPageBreak(12);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textColor);
      doc.text(institution, margin, L.y);
      L.y += 5;
      courses.forEach((course) => L.addBullet(course));
      L.y += 2;
    });
  }

  // ─── Footer ──────────────────────────────────────────────────────
  L.addPageFooters(`${data.personalInfo.name} — CV  |  ${t('cv.page')}`);

  return doc;
}

export function downloadSimpleCV(
  data: SimpleCVData,
  language: 'es' | 'en',
  t: (key: string) => string
) {
  const pdf = generateSimplePDF(data, t);
  const fileName = `Jose_Pablo_Campos_CV_Simple_${language.toUpperCase()}_${new Date().getFullYear()}.pdf`;
  pdf.save(fileName);
}

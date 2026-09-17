import jsPDF from 'jspdf';
import { CVData } from '@/contexts/language-context';
import { getCvSkillGroups } from '@/services/cv.service';
import { formatPhoneDisplay } from '@/lib/phone';
import {
  PDF_COLORS,
  createPdfLayout,
  addBulletsWithWidowControl,
  toBullets,
} from '@/utils/pdf-layout';

export function generatePDF(data: CVData, language: 'es' | 'en', t: (key: string) => string) {
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
    doc.text(line, margin, L.y);
    L.y += 4.5;
  });
  L.y += 3;

  // ─── Profile paragraph (with ATS-friendly heading, left-aligned) ─
  L.addSectionTitle(t('cv.summary'));
  L.addParagraph(data.about, 10, textColor, false, false);
  L.y += 2;

  // ─── Technical Skills (label/value rows) ─────────────────────────
  L.addSectionTitle(t('skills.title'));

  getCvSkillGroups(t).forEach((group) => {
    L.addLabelValue(`${group.label}:`, group.items.join(', '));
  });
  L.y += 2;

  // ─── Work Experience ─────────────────────────────────────────────
  L.addSectionTitle(t('experience.title'));

  const techLabel = `${t('cv.techLabel')}:`;
  const respLabel = `${t('cv.respLabel')}:`;
  const achieveLabel = `${t('cv.achieveLabel')}:`;

  data.experience.forEach((company) => {
    const visibleRoles = company.roles.filter((r) => !r.hideFromPdf);
    visibleRoles.forEach((role, idx) => {
      L.checkPageBreak(28);

      // Role line: "Title – Company"
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textColor);
      doc.text(`${role.title} – ${company.company}`, margin, L.y);
      L.y += 5;

      // Period
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(lightTextColor);
      doc.text(role.period, margin, L.y);
      L.y += 5;

      // Responsibilities
      const respBullets = role.responsibilities ? toBullets(role.responsibilities) : [];
      const achievBullets = role.achievements ? toBullets(role.achievements) : [];

      if (respBullets.length > 0) {
        L.checkPageBreak(14);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textColor);
        doc.text(respLabel, margin, L.y);
        L.y += 3.5;

        addBulletsWithWidowControl(L, respBullets);
        L.y += 2;
      }

      // Achievements
      if (achievBullets.length > 0) {
        L.checkPageBreak(14);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textColor);
        doc.text(achieveLabel, margin, L.y);
        L.y += 3.5;

        addBulletsWithWidowControl(L, achievBullets);
        L.y += 2;
      }

      // Fallback for legacy description
      if (respBullets.length === 0 && achievBullets.length === 0 && role.description) {
        L.checkPageBreak(14);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textColor);
        doc.text(respLabel, margin, L.y);
        L.y += 3.5;

        addBulletsWithWidowControl(L, toBullets(role.description));
        L.y += 2;
      }

      // Technologies (rendered after achievements)
      if (idx === visibleRoles.length - 1 && company.skills.length > 0) {
        L.checkPageBreak(10);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textColor);
        const techPrefix = `${techLabel} `;
        const techPrefixWidth = doc.getTextWidth(techPrefix);
        doc.text(techPrefix, margin, L.y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(lightTextColor);
        const techText = company.skills.join(', ');
        const techLines: string[] = doc.splitTextToSize(techText, contentWidth - techPrefixWidth);
        techLines.forEach((line: string, lineIdx: number) => {
          if (lineIdx === 0) {
            doc.text(line, margin + techPrefixWidth, L.y);
          } else {
            L.y += 4.5;
            doc.text(line, margin, L.y);
          }
        });
        L.y += 5;
      }
    });
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

  // ─── Continuing Education ────────────────────────────────────────
  L.addSectionTitle(t('education.trainingSubtitle'));

  const groups: { [key: string]: typeof data.additionalTraining } = {};
  data.additionalTraining.forEach((tr) => {
    if (!groups[tr.institution]) groups[tr.institution] = [];
    groups[tr.institution].push(tr);
  });
  Object.entries(groups).forEach(([institution, items]) => {
    L.checkPageBreak(12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text(institution, margin, L.y);
    L.y += 5;
    items.forEach((item) => L.addBullet(item.name));
    L.y += 2;
  });

  // ─── Certifications ──────────────────────────────────────────────
  // Keep all certs together: if they won't all fit on the current page,
  // start them on a new page.
  const certsTotalHeight = data.certifications.reduce(
    (sum, cert) => sum + L.measureBulletHeight(cert.name),
    18 // section title height
  );
  if (L.y + certsTotalHeight > pageHeight - bottomMargin) {
    doc.addPage();
    L.y = 18;
  }
  L.addSectionTitle(t('education.certificationsSubtitle'));
  data.certifications.forEach((cert) => {
    L.addBullet(cert.name);
  });

  // ─── Footer ──────────────────────────────────────────────────────
  L.addPageFooters(`${data.personalInfo.name} — CV  |  ${t('cv.page')}`);

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

import jsPDF from 'jspdf';
import { CVData } from '@/contexts/language-context';

export function generatePDF(data: CVData, language: 'es' | 'en', t: (key: string) => string) {
  const doc = new jsPDF();
  let yPosition = 20;
  let currentColumn = 1; // 1 for left, 2 for right
  let isSecondPage = false;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  const columnWidth = (contentWidth - 10) / 2; // 10 for column gap
  const leftColumnX = margin;
  const rightColumnX = margin + columnWidth + 10;

  // Colors
  const primaryColor = '#1e3a8a'; // Dark blue accent
  const textColor = '#374151';
  const lightTextColor = '#6b7280';

  // Helper functions
  const getCurrentX = () => currentColumn === 1 ? leftColumnX : rightColumnX;
  const getCurrentWidth = () => currentColumn === 1 && !isSecondPage ? contentWidth : columnWidth;

  const addTitle = (title: string, size: number = 16) => {
    doc.setFontSize(size);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(title, getCurrentX(), yPosition);
    yPosition += size === 16 ? 12 : 8;
    
    // Add underline
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    const titleWidth = doc.getTextWidth(title);
    doc.line(getCurrentX(), yPosition - 6, getCurrentX() + titleWidth, yPosition - 6);
    yPosition += 4;
  };

  const addText = (text: string, fontSize: number = 10, color: string = textColor, isBold: boolean = false, justify: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    if (justify && text.includes('\n')) {
      // Handle text with line breaks - justify each paragraph separately
      const paragraphs = text.split('\n');
      paragraphs.forEach((paragraph, index) => {
        if (paragraph.trim()) {
          const lines = doc.splitTextToSize(paragraph.trim(), getCurrentWidth());
          lines.forEach((line: string, lineIndex: number) => {
            if (justify && lineIndex < lines.length - 1 && lines.length > 1) {
              // Justify line by distributing spaces
              const words = line.split(' ');
              if (words.length > 1) {
                const totalTextWidth = words.reduce((sum, word) => sum + doc.getTextWidth(word), 0);
                const totalSpaceNeeded = getCurrentWidth() - totalTextWidth;
                const spacePerGap = totalSpaceNeeded / (words.length - 1);
                
                let currentX = getCurrentX();
                words.forEach((word, wordIndex) => {
                  doc.text(word, currentX, yPosition);
                  if (wordIndex < words.length - 1) {
                    currentX += doc.getTextWidth(word) + spacePerGap;
                  }
                });
              } else {
                doc.text(line, getCurrentX(), yPosition);
              }
            } else {
              doc.text(line, getCurrentX(), yPosition);
            }
            yPosition += fontSize * 0.6;
          });
        }
        if (index < paragraphs.length - 1) yPosition += 0.25; // Space between paragraphs
      });
      yPosition += 4;
    } else {
      const lines = doc.splitTextToSize(text, getCurrentWidth());
      lines.forEach((line: string, lineIndex: number) => {
        if (justify && lineIndex < lines.length - 1 && lines.length > 1) {
          // Justify line by distributing spaces
          const words = line.split(' ');
          if (words.length > 1) {
            const totalTextWidth = words.reduce((sum, word) => sum + doc.getTextWidth(word), 0);
            const totalSpaceNeeded = getCurrentWidth() - totalTextWidth;
            const spacePerGap = totalSpaceNeeded / (words.length - 1);
            
            let currentX = getCurrentX();
            words.forEach((word, wordIndex) => {
              doc.text(word, currentX, yPosition);
              if (wordIndex < words.length - 1) {
                currentX += doc.getTextWidth(word) + spacePerGap;
              }
            });
          } else {
            doc.text(line, getCurrentX(), yPosition);
          }
        } else {
          doc.text(line, getCurrentX(), yPosition);
        }
        yPosition += fontSize * 0.6;
      });
      yPosition += lines.length > 4 ? 1 : 4;
    }
  };

  const addSubtitle = (text: string, fontSize: number = 10, color: string = lightTextColor) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    doc.setFont('helvetica', 'normal');
    
    const lines = doc.splitTextToSize(text, getCurrentWidth());
    doc.text(lines, getCurrentX(), yPosition);
    yPosition += lines.length * fontSize * 0.6 + 2;
  };

  const addBulletPoint = (text: string, indent: number = 5) => {
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    doc.text('•', getCurrentX() + indent, yPosition);
    
    const lines = doc.splitTextToSize(text, getCurrentWidth() - indent - 5);
    doc.text(lines, getCurrentX() + indent + 8, yPosition);
    yPosition += lines.length * 6 + 2;
  };

  const checkPageBreak = (additionalSpace: number = 20) => {
    if (yPosition + additionalSpace > doc.internal.pageSize.height - 20) {
      if (!isSecondPage) {
        doc.addPage();
        yPosition = 20;
        isSecondPage = true;
        currentColumn = 1;
      } else if (currentColumn === 1) {
        // Switch to right column
        currentColumn = 2;
        yPosition = 20;
      } else {
        // Add new page and reset
        doc.addPage();
        yPosition = 20;
        currentColumn = 1;
      }
    }
  };

  // Header (always full width on first page)
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(data.personalInfo.name, margin, yPosition);
  yPosition += 12; // Reduced from 18

  doc.setFontSize(14);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  doc.text(data.personalInfo.title, margin, yPosition);
  yPosition += 15; // Reduced from 20

  // Contact Information (always full width on first page)
  doc.setFontSize(10);
  doc.setTextColor(lightTextColor);
  const contactLabels = {
    email: 'Email:',
    phone: t('about.phone'),
    location: t('about.nationality'),
    languages: t('about.languages')
  };
  
  const contactInfo = [
    `${contactLabels.email} ${data.personalInfo.email}`,
    `${contactLabels.phone} ${data.personalInfo.phone}`,
    `${contactLabels.location} ${data.personalInfo.location}`,
    `${contactLabels.languages} ${data.personalInfo.languages}`
  ];
  
  contactInfo.forEach((info) => {
    doc.text(info, margin, yPosition);
    yPosition += 6; // Reduced from 8
  });
  yPosition += 8; // Reduced from 10

  // About Section
  addTitle(t('about.title'));
  addText(data.about, 10, textColor, false, true);
  yPosition += 2;

  // Professional Experience Section (full width on first page)
  addTitle(t('experience.title'));

  data.experience.forEach((exp: { title: string; company: string; period: string; description: string; skills: string[] }, index: number) => {
    addText(exp.title, 12, textColor, true);
    yPosition -= 4; // Reduce space between title and subtitle
    addSubtitle(`${exp.company} | ${exp.period}`);
    yPosition -= 1;

    // For Java Developer (index 2), only show first part of description
    if (index === 2) {
        addText(exp.description, 10, textColor, false, true);
    } else {
        addText(exp.description, 10, textColor, false, true);

        // Show technologies for Professional Services (index 0) and Web Developer (index 1)
        if (exp.skills.length > 0) {
            yPosition -= 3;
            addText(t('cv.technologies'), 10, textColor, true);
            yPosition -= 4;
            addText(exp.skills.join(', '), 10, lightTextColor);
        }
    }
  });

  // Second page
  doc.addPage();
  yPosition = 20;
  
  // Add continuation of Java Developer experience (full width) - FIRST THING ON PAGE 2
  addText(t('experience.javaDevDesc2'), 10, textColor, false, true);
  
  // Add technologies for Java Developer role
  const javaDevSkills = data.experience.find(exp => exp.title === t('experience.javaDevTitle'))?.skills || [];
  if (javaDevSkills.length > 0) {
    yPosition -= 3;
    addText(t('cv.technologies'), 10, textColor, true);
    yPosition -= 4;
    addText(javaDevSkills.join(', '), 10, lightTextColor);
  }
  yPosition += 5;

  // Start two-column layout for education and technical skills
  isSecondPage = true;
  currentColumn = 1;
  const educationSkillsStartY = yPosition;

  // Left Column: Education
  addTitle(t('education.educationSubtitle'));
  
  data.education.forEach((edu: { degree: string; institution: string; period: string }) => {
    addText(edu.degree, 11, textColor, true);
    yPosition -= 2; // Reduce space after degree
    addText(edu.institution, 10, lightTextColor);
    yPosition -= 3; // Reduce space after institution
    addText(edu.period, 10, lightTextColor);
    yPosition += 2; // Add space between education entries
  });

  // Add Additional Training in the same column after education
  yPosition += 2;
  addTitle(t('education.trainingSubtitle'));
  
  // Group by institution
  const ucr = data.additionalTraining.filter((training: { name: string; institution: string; date: string }) => training.institution.includes('UCR') || training.institution.includes('Academia'));
  const miramar = data.additionalTraining.filter((training: { name: string; institution: string; date: string }) => training.institution.includes('Miramar'));
  const aws = data.additionalTraining.filter((training: { name: string; institution: string; date: string }) => training.institution.includes('AWS'));
  
  // UCR Academy section
  if (ucr.length > 0) {
    addText(ucr[0].institution, 10, textColor, true);
    yPosition -= 2; // Reduce space after institution title
    ucr.forEach((training: { name: string; institution: string; date: string }) => {
      addBulletPoint(training.name);
    });
    yPosition += 2; // Add space between institutions
  }
  
  // Miramar Community Center section
  if (miramar.length > 0) {
    addText(miramar[0].institution, 10, textColor, true);
    yPosition -= 2; // Reduce space after institution title
    miramar.forEach((training: { name: string; institution: string; date: string }) => {
      addBulletPoint(training.name);
    });
    yPosition += 4; // Add space between institutions
  }
  
  // AWS Skill Builder section
  if (aws.length > 0) {
    addText(aws[0].institution, 10, textColor, true);
    yPosition -= 2; // Reduce space after institution title
    aws.forEach((training: { name: string; institution: string; date: string }) => {
      addBulletPoint(training.name);
    });
  }

  // Right Column: Technical Skills
  currentColumn = 2;
  yPosition = educationSkillsStartY;

  addTitle(t('skills.title'));
  
  // Define actual skills matching the website
  const coreSkills = [
    "Java (Spring Boot)", "Python (FastAPI)", "PHP", "Node.js", "JavaScript & HTML"
  ];
  
  const cloudSkills = [
    "AWS Infrastructure", "CloudFormation", "SAM Templates", "Microservices Architecture", "Serverless Programming"
  ];
  
  const databaseSkills = [
    "MySQL", "PostgreSQL", "Oracle", "Microsoft SQL Server"
  ];
  
  const toolsSkills = [
    "Rest API Services", "Bash Scripting", "Linux", "Git", "CI/CD"
  ];

  const skillSections = [
    { title: t('skills.backend'), skills: coreSkills },
    { title: t('skills.cloud'), skills: cloudSkills },
    { title: t('skills.databases'), skills: databaseSkills },
    { title: t('skills.tools'), skills: toolsSkills }
  ];

  skillSections.forEach((section) => {
    addText(`${section.title}`, 10, textColor, true);
    yPosition -= 2; // Reduce space after skill category title
    addText(section.skills.join(', '), 10, lightTextColor);
    yPosition += 2; // Add space between skill categories
  });

  yPosition += 6;

  // Certifications (after Technical Skills in right column)
  addTitle(t('education.certificationsSubtitle'));
  data.certifications.forEach((cert: { name: string; date: string }) => {
    addBulletPoint(`${cert.name} (${cert.date})`);
  });


  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(lightTextColor);
    doc.text(
      `José Pablo Campos Solano - CV | ${language === 'es' ? 'Página' : 'Page'} ${i}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
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
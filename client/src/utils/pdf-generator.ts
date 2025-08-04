import jsPDF from 'jspdf';

interface CVData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    languages: string;
  };
  about: string;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
    skills: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
  }>;
  certifications: Array<{
    name: string;
    date: string;
  }>;
  skills: {
    backend: string[];
    cloud: string[];
    databases: string[];
    tools: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export function generatePDF(data: CVData, language: 'es' | 'en') {
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
  const primaryColor = '#22c55e'; // Green accent
  const textColor = '#374151';
  const lightTextColor = '#6b7280';

  // Helper functions
  const getCurrentX = () => currentColumn === 1 ? leftColumnX : rightColumnX;
  const getCurrentWidth = () => isSecondPage ? columnWidth : contentWidth;

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
    doc.line(getCurrentX(), yPosition - 2, getCurrentX() + titleWidth, yPosition - 2);
    yPosition += 8;
  };

  const addText = (text: string, fontSize: number = 10, color: string = textColor, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, getCurrentWidth());
    doc.text(lines, getCurrentX(), yPosition);
    yPosition += lines.length * fontSize * 0.6 + 4;
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
  yPosition += 18;

  doc.setFontSize(14);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  doc.text(data.personalInfo.title, margin, yPosition);
  yPosition += 20;

  // Contact Information (always full width on first page)
  doc.setFontSize(10);
  doc.setTextColor(lightTextColor);
  const contactLabels = {
    email: language === 'es' ? 'Email:' : 'Email:',
    phone: language === 'es' ? 'Teléfono:' : 'Phone:',
    location: language === 'es' ? 'Ubicación:' : 'Location:',
    languages: language === 'es' ? 'Idiomas:' : 'Languages:'
  };
  
  const contactInfo = [
    `${contactLabels.email} ${data.personalInfo.email}`,
    `${contactLabels.phone} ${data.personalInfo.phone}`,
    `${contactLabels.location} ${data.personalInfo.location}`,
    `${contactLabels.languages} ${data.personalInfo.languages}`
  ];
  
  contactInfo.forEach((info) => {
    doc.text(info, margin, yPosition);
    yPosition += 8;
  });
  yPosition += 10;

  // About Section
  checkPageBreak();
  addTitle(language === 'es' ? 'Acerca de Mí' : 'About Me');
  addText(data.about);

  // Experience Section
  checkPageBreak();
  addTitle(language === 'es' ? 'Experiencia Profesional' : 'Professional Experience');
  
  data.experience.forEach((exp) => {
    checkPageBreak(30);
    addText(exp.title, 12, textColor, true);
    addText(`${exp.company} | ${exp.period}`, 10, lightTextColor);
    addText(exp.description);
    
    if (exp.skills.length > 0) {
      addText(language === 'es' ? 'Tecnologías:' : 'Technologies:', 10, textColor, true);
      addText(exp.skills.join(', '), 10, lightTextColor);
    }
    yPosition += 8;
  });

  // Education Section
  checkPageBreak();
  addTitle(language === 'es' ? 'Educación' : 'Education');
  
  data.education.forEach((edu) => {
    addText(edu.degree, 11, textColor, true);
    addText(edu.institution, 10, lightTextColor);
    addText(edu.period, 10, lightTextColor);
    yPosition += 6;
  });

  // Certifications Section
  checkPageBreak();
  addTitle(language === 'es' ? 'Certificaciones' : 'Certifications');
  
  data.certifications.forEach((cert) => {
    addBulletPoint(`${cert.name} (${cert.date})`);
  });

  // Add spacing before Skills Section
  yPosition += 10;

  // Skills Section
  checkPageBreak();
  addTitle(language === 'es' ? 'Habilidades Técnicas' : 'Technical Skills');
  
  const skillSections = [
    { title: 'Backend', skills: data.skills.backend },
    { title: language === 'es' ? 'Nube' : 'Cloud', skills: data.skills.cloud },
    { title: language === 'es' ? 'Bases de Datos' : 'Databases', skills: data.skills.databases },
    { title: language === 'es' ? 'Herramientas' : 'Tools', skills: data.skills.tools }
  ];

  skillSections.forEach((section) => {
    addText(`${section.title}:`, 10, textColor, true);
    addText(section.skills.join(', '), 10, lightTextColor);
    yPosition += 4;
  });

  // Projects Section
  checkPageBreak();
  addTitle(language === 'es' ? 'Proyectos Destacados' : 'Featured Projects');
  
  data.projects.forEach((project) => {
    checkPageBreak(25);
    addText(project.name, 11, textColor, true);
    addText(project.description);
    addText(`${language === 'es' ? 'Tecnologías:' : 'Technologies:'} ${project.technologies.join(', ')}`, 10, lightTextColor);
    yPosition += 8;
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

export function downloadCV(language: 'es' | 'en') {
  const cvData: CVData = {
    personalInfo: {
      name: 'José Pablo Campos Solano',
      title: language === 'es' ? 'Desarrollador Backend' : 'Backend Developer',
      email: 'chepelcr@outlook.com',
      phone: '(506) 7039-1069',
      location: 'Costa Rica',
      languages: language === 'es' ? 'Español (Nativo), Inglés (B2)' : 'Spanish (Native), English (B2)'
    },
    about: language === 'es' 
      ? 'Desarrollador de software especializado en BackEnd con Java (Spring Boot) y Python. Durante los últimos dos años, he estado desarrollando mi propio sistema ERP para facturación electrónica, integrando microservicios, bases de datos relacionales, mensajería asíncrona y servicios cloud con AWS. He participado en comunidades de software de código abierto y asisto activamente a eventos de tecnología.'
      : 'Software developer specialized in Backend with Java (Spring Boot) and Python. For the last two years, I have been developing my own ERP system for electronic invoicing, integrating microservices, relational databases, asynchronous messaging and cloud services with AWS. I have participated in open source software communities and actively attend technology events.',
    experience: [
      {
        title: 'Java Developer',
        company: 'IFZ Sociedad Anónima',
        period: language === 'es' ? 'Julio 2022 - Junio 2025' : 'July 2022 - June 2025',
        description: language === 'es'
          ? 'Desarrollo de microservicios, gestión de servicios AWS e infraestructura. Implementación de soluciones escalables utilizando arquitecturas modernas y mejores prácticas de desarrollo en la nube.'
          : 'Development of microservices, AWS services management and infrastructure. Implementation of scalable solutions using modern architectures and cloud development best practices.',
        skills: ['Java', 'AWS', 'Microservices', 'Spring Boot']
      },
      {
        title: language === 'es' ? 'Web Developer Ad Honorem' : 'Web Developer Ad Honorem',
        company: 'Modas Laura',
        period: language === 'es' ? '2021 - Actual' : '2021 - Current',
        description: language === 'es'
          ? 'Diseño y desarrollo de sistema ERP personalizado para la gestión empresarial. Implementación de soluciones de facturación electrónica y automatización de procesos de negocio.'
          : 'Design and development of custom ERP system for business management. Implementation of electronic invoicing solutions and business process automation.',
        skills: ['ERP Development', 'Electronic Invoicing', 'PHP', 'MySQL']
      }
    ],
    education: [
      {
        degree: language === 'es' ? 'Bachiller en Informática Empresarial' : 'Bachelor in Business Informatics',
        institution: 'Universidad de Costa Rica, Sede del Pacífico',
        period: '2017 - 2022'
      },
      {
        degree: language === 'es' ? 'Programa del Bachillerato Internacional' : 'International Baccalaureate Diploma Programme',
        institution: 'Liceo de Costa Rica',
        period: '2015 - 2016'
      },
      {
        degree: language === 'es' ? 'Bachiller en Educación Media' : 'Bachelor in Media Education',
        institution: 'Liceo de Costa Rica', 
        period: '2010 - 2016'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect',
        date: '13-04-2023'
      },
      {
        name: 'AWS Certified Cloud Practitioner',
        date: '16-02-2023'
      },
      {
        name: 'Microsoft Certified: Azure Fundamentals',
        date: '22-03-2023'
      },
      {
        name: 'CCNA: Introduction to Networks',
        date: '2023'
      },
      {
        name: 'EF SET English Certificate - Nivel B2',
        date: '2023'
      }
    ],
    skills: {
      backend: ['Java', 'Spring Boot', 'Python', 'Node.js', 'PHP'],
      cloud: ['AWS', 'Microsoft Azure', 'Docker', 'Kubernetes'],
      databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
      tools: ['Git', 'Jenkins', 'Postman', 'VS Code', 'IntelliJ IDEA']
    },
    projects: [
      {
        name: language === 'es' ? 'Sistema ERP para Facturación Electrónica' : 'ERP System for Electronic Invoicing',
        description: language === 'es'
          ? 'Sistema integral de gestión empresarial desarrollado con arquitectura de microservicios. Incluye facturación electrónica integrada con el Ministerio de Hacienda de Costa Rica, gestión de inventario, reportes avanzados y API REST para integraciones.'
          : 'Comprehensive business management system developed with microservices architecture. Includes electronic invoicing integrated with Costa Rica Ministry of Finance, inventory management, advanced reports and REST API for integrations.',
        technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS', 'Microservices']
      },
      {
        name: language === 'es' ? 'Sitio Web de Comandos Linux' : 'Linux Commands Website',
        description: language === 'es'
          ? 'Plataforma educativa interactiva para aprender comandos básicos de Linux. Incluye conceptos fundamentales, ejemplos prácticos, herramientas de administración y utilidades para desarrolladores y administradores de sistemas.'
          : 'Interactive educational platform for learning basic Linux commands. Includes fundamental concepts, practical examples, administration tools and utilities for developers and system administrators.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js']
      }
    ]
  };

  const pdf = generatePDF(cvData, language);
  const fileName = `Jose_Pablo_Campos_CV_${language.toUpperCase()}_${new Date().getFullYear()}.pdf`;
  pdf.save(fileName);
}
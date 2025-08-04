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
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Colors
  const primaryColor = '#22c55e'; // Green accent
  const textColor = '#374151';
  const lightTextColor = '#6b7280';

  // Helper functions
  const addTitle = (title: string, size: number = 16) => {
    doc.setFontSize(size);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, yPosition);
    yPosition += size === 16 ? 12 : 8;
    
    // Add underline
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition - 2, margin + doc.getTextWidth(title), yPosition - 2);
    yPosition += 8;
  };

  const addText = (text: string, fontSize: number = 10, color: string = textColor, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * fontSize * 0.6 + 4;
  };

  const addBulletPoint = (text: string, indent: number = 5) => {
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    doc.text('•', margin + indent, yPosition);
    
    const lines = doc.splitTextToSize(text, contentWidth - indent - 5);
    doc.text(lines, margin + indent + 8, yPosition);
    yPosition += lines.length * 6 + 2;
  };

  const checkPageBreak = (additionalSpace: number = 20) => {
    if (yPosition + additionalSpace > doc.internal.pageSize.height - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Header
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

  // Contact Information
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
    addText(edu.period, 10, lightTextColor);
    yPosition += 4;
  });

  // Certifications Section
  checkPageBreak();
  addTitle(language === 'es' ? 'Certificaciones' : 'Certifications');
  
  data.certifications.forEach((cert) => {
    addBulletPoint(`${cert.name} (${cert.date})`);
  });

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
        period: '2019 - 2021'
      },
      {
        degree: language === 'es' ? 'Programa del Bachillerato Internacional' : 'International Baccalaureate Diploma Programme',
        period: '2017 - 2019'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Cloud Practitioner',
        date: '2023'
      },
      {
        name: 'Microsoft Azure Fundamentals',
        date: '2023'
      },
      {
        name: 'Cisco Networking Basics',
        date: '2022'
      },
      {
        name: 'CCNA: Introduction to Networks',
        date: '2022'
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
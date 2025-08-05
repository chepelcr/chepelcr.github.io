import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

export type Language = "es" | "en";
export type Section = "home" | "about" | "skills" | "experience" | "education" | "projects" | "contact";

type LanguageContextType = {
  language: Language;
  currentSection: Section | null;
  setLanguage: (lang: Language) => void;
  navigateToSection: (section: Section, updateUrl?: boolean) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [location, navigate] = useLocation();
  const [language, setLanguageState] = useState<Language>("es");
  const [currentSection, setCurrentSection] = useState<Section | null>(null);

  // Parse language and section from URL
  useEffect(() => {
    const pathParts = location.split('/').filter(Boolean);
    const urlLang = pathParts[0] as Language;
    const urlSection = pathParts[1] as Section;

    if (urlLang === "es" || urlLang === "en") {
      setLanguageState(urlLang);
      localStorage.setItem("portfolio-language", urlLang);
      setCurrentSection(urlSection || "home");
    }
  }, [location]);

  const setLanguage = (lang: Language) => {
    // Don't transition if already on the selected language
    if (lang === language) {
      return;
    }
    
    // Get current scroll position to maintain it
    const currentScrollY = window.scrollY;
    
    // Prevent any scrolling during transition
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${currentScrollY}px`;
    document.body.style.width = '100%';
    
    // Add slide-out animation
    document.body.classList.add("language-transitioning");
    
    setTimeout(() => {
      const pathParts = location.split('/').filter(Boolean);
      const currentSectionFromUrl = pathParts[1] || "home";
      
      setLanguageState(lang);
      localStorage.setItem("portfolio-language", lang);
      
      // Navigate to new language with current section
      const newPath = currentSectionFromUrl === "home" ? `/${lang}` : `/${lang}/${currentSectionFromUrl}`;
      navigate(newPath);
      
      // Add slide-in animation
      document.body.classList.remove("language-transitioning");
      document.body.classList.add("slide-in");
      
      // Remove slide-in class and restore scroll after animation
      setTimeout(() => {
        document.body.classList.remove("slide-in");
        
        // Restore scroll position and body styles
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo({ top: currentScrollY, behavior: 'instant' });
      }, 300);
    }, 300);
  };

  const navigateToSection = (section: Section, updateUrl: boolean = true) => {
    setCurrentSection(section);
    if (updateUrl) {
      const newPath = section === "home" ? `/${language}` : `/${language}/${section}`;
      navigate(newPath);
    }
    
    // Scroll to the section
    const element = document.getElementById(section);
    if (element) {
      const headerOffset = 80; // Account for fixed navigation
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const t = (key: string): string => {
    const translation = translations[language] as Record<string, string>;
    return translation[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, currentSection, setLanguage, navigateToSection, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

const translations = {
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.about": "Acerca de",
    "nav.skills": "Habilidades",
    "nav.experience": "Experiencia",
    "nav.education": "Educación",
    "nav.projects": "Proyectos",
    "nav.contact": "Contacto",
    
    // Hero Section
    "hero.greeting": "¡Hola! Soy",
    "hero.title": "Desarrollador Backend",
    "hero.subtitle": "Especializado en Java, Python y AWS",
    "hero.description": "Desarrollador de software especializado en soluciones Backend con Java, Python y AWS. Creando sistemas escalables que impulsan el crecimiento empresarial.",
    "hero.contactMe": "Contáctame",
    "hero.downloadCV": "Descargar CV",
    
    // About Section
    "about.title": "Acerca de Mí",
    "about.description": "Soy un desarrollador de software con experiencia en tecnologías backend, especializado en Java con Spring Boot y Python. Mi pasión por la tecnología me ha llevado a obtener certificaciones en AWS, Microsoft Azure y Cisco, lo que me permite diseñar y desarrollar soluciones escalables en la nube.",
    "about.yearsExperience": "Años de Experiencia",
    "about.projectsCompleted": "Proyectos Completados",
    "about.certifications": "Certificaciones",
    "about.professionalProfile": "Perfil Profesional",
    "about.personalInfo": "Información Personal",
    "about.nationality": "Nacionalidad:",
    "about.languages": "Idiomas:",
    "about.languageProficiency": "Español (Nativo), Inglés (B2)",
    "about.phone": "Teléfono:",
    "about.id": "ID:",
    "about.profileDesc1": "Soy un desarrollador de software especializado en BackEnd con Java (Spring Boot) y Python. Durante los últimos dos años, he estado desarrollando mi propio sistema ERP para facturación electrónica, integrando microservicios, bases de datos relacionales, mensajería asíncrona y servicios cloud con AWS.",
    "about.profileDesc2": "He participado en comunidades de software de código abierto y asisto activamente a eventos de tecnología como Firefox y Drupal Camp. Me apasiona construir soluciones escalables y limpias enfocadas en generar un impacto real en los procesos de negocio.",
    
    // Skills Section
    "skills.title": "Habilidades Técnicas",
    "skills.backend": "Backend",
    "skills.cloud": "Nube",
    "skills.databases": "Bases de Datos",
    "skills.tools": "Herramientas",
    "skills.softSkills": "Habilidades Blandas",
    "skills.analyticalThinking": "Pensamiento Analítico",
    "skills.analyticalDesc": "Enfoque en resolución de problemas",
    "skills.teamwork": "Trabajo Colaborativo",
    "skills.teamworkDesc": "Comunicación efectiva con equipos multidisciplinarios",
    "skills.adaptability": "Adaptabilidad",
    "skills.adaptabilityDesc": "Capacidad de cambio y aprendizaje continuo",
    "skills.initiative": "Iniciativa",
    "skills.initiativeDesc": "Curiosidad por nuevas tecnologías y metodologías",
    
    // Experience Section
    "experience.title": "Experiencia Profesional",
    "experience.current": "Actual",
    "experience.javaDevTitle": "Java Developer",
    "experience.javaDevCompany": "IFZ Sociedad Anónima",
    "experience.javaDevPeriod": "Julio 2022 - Junio 2025",
    "experience.javaDevDesc": "Desarrollo de microservicios, gestión de servicios AWS e infraestructura. Implementación de soluciones escalables utilizando arquitecturas modernas y mejores prácticas de desarrollo en la nube.",
    "experience.webDevTitle": "Web Developer Ad Honorem",
    "experience.webDevCompany": "Modas Laura",
    "experience.webDevPeriod": "2021 - Actual",
    "experience.webDevDesc": "Diseño y desarrollo de sistema ERP personalizado para la gestión empresarial. Implementación de soluciones de facturación electrónica y automatización de procesos de negocio.",
    
    // Education Section
    "education.title": "Educación y Certificaciones",
    "education.educationSubtitle": "Educación",
    "education.certificationsSubtitle": "Certificaciones",
    "education.trainingSubtitle": "Capacitaciones Adicionales",
    "education.activationDate": "Fecha de activación:",
    "education.verifyCredential": "Verificar Certificación",
    "education.businessInformatics": "Bachiller en Informática Empresarial",
    "education.internationalBaccalaureate": "Programa del Bachillerato Internacional",
    "education.mediaEducation": "Bachiller en Educación Media",
    
    // Projects Section
    "projects.title": "Proyectos Destacados",
    "projects.viewProject": "Ver Proyecto",
    "projects.enterIvois": "Entrar a IVOIS",
    "projects.erpTitle": "Sistema ERP para Facturación Electrónica",
    "projects.erpDesc": "Sistema integral de gestión empresarial desarrollado con arquitectura de microservicios. Incluye facturación electrónica integrada con el Ministerio de Hacienda de Costa Rica, gestión de inventario, reportes avanzados y API REST para integraciones.",
    "projects.videoTranscriptTitle": "Transcripción de Video con IA",
    "projects.videoTranscriptDesc": "Herramienta inteligente que extrae automáticamente el texto y subtítulos de videos utilizando servicios de inteligencia artificial avanzados. Soporta múltiples formatos de video y proporciona transcripciones precisas en tiempo real.",
    "projects.videoFeature1": "Transcripción automática con IA",
    "projects.videoFeature2": "Soporte para múltiples formatos",
    "projects.videoFeature3": "Interface multiidioma",
    "projects.videoFeature4": "Exportación de subtítulos",
    "projects.linuxTitle": "Sitio Web de Comandos Linux",
    "projects.linuxDesc": "Plataforma educativa interactiva para aprender comandos básicos de Linux. Incluye conceptos fundamentales, ejemplos prácticos, herramientas de administración y utilidades para desarrolladores y administradores de sistemas.",
    "projects.feature1": "Interface interactiva y responsive",
    "projects.feature2": "Ejemplos de comandos categorizados",
    "projects.feature3": "Guías de seguridad informática",
    "projects.feature4": "Herramientas de administración",
    "projects.ecommerceTitle": "E-commerce API",
    "projects.ecommerceDesc": "API REST para plataforma de comercio electrónico",
    "projects.dashboardTitle": "Dashboard de Analytics",
    "projects.dashboardDesc": "Panel de control para análisis de datos empresariales",
    "projects.characteristics": "Características:",
    "projects.technologies": "Tecnologías:",
    "projects.technologiesUsed": "Tecnologías Utilizadas:",
    "projects.otherProjects": "Otros Proyectos",
    "projects.visitSite": "Visitar Sitio",
    "projects.viewDetails": "Ver Detalles",
    
    // Contact Section
    "contact.title": "Contáctame",
    "contact.subtitle": "¿Tienes un proyecto en mente? ¡Hablemos!",
    "contact.description": "Estoy siempre interesado en nuevas oportunidades y proyectos desafiantes. No dudes en contactarme.",
    "contact.name": "Nombre",
    "contact.email": "Correo Electrónico",
    "contact.subject": "Asunto",
    "contact.message": "Mensaje",
    "contact.send": "Enviar Mensaje",
    "contact.sending": "Enviando...",
    "contact.success": "¡Mensaje enviado exitosamente!",
    "contact.error": "Error al enviar el mensaje. Inténtalo de nuevo.",
    "contact.phone": "Teléfono",
    "contact.location": "Ubicación",
    "contact.website": "Sitio Web",
    "contact.availability": "Disponibilidad",
    "contact.freelanceProjects": "Proyectos Freelance",
    "contact.awsConsulting": "Consultorías AWS", 
    "contact.erpDevelopment": "Desarrollo de ERP",
    "contact.fullTime": "Tiempo Completo",
    "contact.available": "Disponible",
    "contact.considering": "Considerando",
    "contact.contactInfo": "Información de Contacto",
    "contact.messageSentTitle": "¡Mensaje enviado!",
    "contact.messageSentDesc": "Te contactaré pronto. Gracias por tu interés.",
    "contact.errorSendingTitle": "Error al enviar mensaje",
    "contact.errorSendingDesc": "Hubo un problema al enviar tu mensaje. Por favor intenta más tarde.",
    "contact.connectionErrorTitle": "Error de conexión",
    "contact.connectionErrorDesc": "No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.",
    "contact.sendMessage": "Envíame un Mensaje",
    "contact.fullName": "Nombre Completo",
    "contact.fullNamePlaceholder": "Tu nombre completo",
    "contact.emailPlaceholder": "tu@email.com",
    "contact.selectSubject": "Selecciona un asunto",
    "contact.messagePlaceholder": "Describe tu proyecto o consulta...",
    "contact.softwareDev": "Desarrollo de Software",
    "contact.awsConsultancy": "Consultoría AWS",
    "contact.erpSystem": "Sistema ERP",
    "contact.freelanceProject": "Proyecto Freelance",
    "contact.jobOpportunity": "Oportunidad Laboral",
    "contact.other": "Otro",
    "contact.downloadCV": "Descarga mi CV",
    "contact.downloadCVDesc": "Obtén una copia completa de mi currículum vitae",
    "contact.defaultSubject": "Contacto desde el portafolio",
    "contact.emailClientTitle": "Cliente de email abierto",
    "contact.emailClientDesc": "Se ha abierto tu cliente de email predeterminado con el mensaje preparado.",
    
    // Footer
    "footer.description": "Desarrollador de software especializado en soluciones Backend con Java, Python y AWS. Creando sistemas escalables que impulsan el crecimiento empresarial.",
    "footer.rights": "Todos los derechos reservados.",
    "footer.developedWith": "Desarrollado con",
    "footer.modernTech": "utilizando tecnologías modernas",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.experience": "Experience",
    "nav.education": "Education",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    
    // Hero Section
    "hero.greeting": "Hello! I'm",
    "hero.title": "Backend Developer",
    "hero.subtitle": "Specialized in Java, Python and AWS",
    "hero.description": "Software developer specialized in Backend solutions with Java, Python and AWS. Creating scalable systems that drive business growth.",
    "hero.contactMe": "Contact Me",
    "hero.downloadCV": "Download CV",
    
    // About Section
    "about.title": "About Me",
    "about.description": "I am a software developer with experience in backend technologies, specialized in Java with Spring Boot and Python. My passion for technology has led me to obtain certifications in AWS, Microsoft Azure and Cisco, which allows me to design and develop scalable cloud solutions.",
    "about.yearsExperience": "Years of Experience",
    "about.projectsCompleted": "Projects Completed",
    "about.certifications": "Certifications",
    "about.professionalProfile": "Professional Profile",
    "about.personalInfo": "Personal Information",
    "about.nationality": "Nationality:",
    "about.languages": "Languages:",
    "about.languageProficiency": "Spanish (Native), English (B2)",
    "about.phone": "Phone:",
    "about.id": "ID:",
    "about.profileDesc1": "I am a software developer specialized in Backend with Java (Spring Boot) and Python. For the last two years, I have been developing my own ERP system for electronic invoicing, integrating microservices, relational databases, asynchronous messaging and cloud services with AWS.",
    "about.profileDesc2": "I have participated in open source software communities and actively attend technology events such as Firefox and Drupal Camp. I am passionate about building scalable and clean solutions focused on generating real impact on business processes.",
    
    // Skills Section
    "skills.title": "Technical Skills",
    "skills.backend": "Backend",
    "skills.cloud": "Cloud",
    "skills.databases": "Databases",
    "skills.tools": "Tools",
    "skills.softSkills": "Soft Skills",
    "skills.analyticalThinking": "Analytical Thinking",
    "skills.analyticalDesc": "Problem-solving focused approach",
    "skills.teamwork": "Collaborative Work",
    "skills.teamworkDesc": "Effective communication with multidisciplinary teams",
    "skills.adaptability": "Adaptability",
    "skills.adaptabilityDesc": "Capacity for change and continuous learning",
    "skills.initiative": "Initiative",
    "skills.initiativeDesc": "Curiosity for new technologies and methodologies",
    
    // Experience Section
    "experience.title": "Professional Experience",
    "experience.current": "Current",
    "experience.javaDevTitle": "Java Developer",
    "experience.javaDevCompany": "IFZ Sociedad Anónima",
    "experience.javaDevPeriod": "July 2022 - June 2025",
    "experience.javaDevDesc": "Development of microservices, AWS services management and infrastructure. Implementation of scalable solutions using modern architectures and cloud development best practices.",
    "experience.webDevTitle": "Web Developer Ad Honorem",
    "experience.webDevCompany": "Modas Laura",
    "experience.webDevPeriod": "2021 - Current",
    "experience.webDevDesc": "Design and development of custom ERP system for business management. Implementation of electronic invoicing solutions and business process automation.",
    
    // Education Section
    "education.title": "Education and Certifications",
    "education.educationSubtitle": "Education",
    "education.certificationsSubtitle": "Certifications",
    "education.trainingSubtitle": "Additional Training",
    "education.activationDate": "Activation date:",
    "education.verifyCredential": "Verify Certification",
    "education.businessInformatics": "Bachelor in Computer Business",
    "education.internationalBaccalaureate": "International Baccalaureate Diploma Programme",
    "education.mediaEducation": "Secondary Education",
    
    // Projects Section
    "projects.title": "Featured Projects",
    "projects.viewProject": "View Project",
    "projects.enterIvois": "Enter IVOIS",
    "projects.erpTitle": "ERP System for Electronic Invoicing",
    "projects.erpDesc": "Comprehensive business management system developed with microservices architecture. Includes electronic invoicing integrated with Costa Rica's Ministry of Finance, inventory management, advanced reporting and REST API for integrations.",
    "projects.videoTranscriptTitle": "AI Video Transcription",
    "projects.videoTranscriptDesc": "Intelligent tool that automatically extracts text and subtitles from videos using advanced artificial intelligence services. Supports multiple video formats and provides accurate real-time transcriptions.",
    "projects.videoFeature1": "Automatic AI transcription",
    "projects.videoFeature2": "Multiple format support",
    "projects.videoFeature3": "Multilingual interface",
    "projects.videoFeature4": "Subtitle export",
    "projects.linuxTitle": "Linux Commands Website",
    "projects.linuxDesc": "Interactive educational platform for learning basic Linux commands. Includes fundamental concepts, practical examples, administration tools and utilities for developers and system administrators.",
    "projects.feature1": "Interactive and responsive interface",
    "projects.feature2": "Categorized command examples",
    "projects.feature3": "Information security guides",
    "projects.feature4": "Administration tools",
    "projects.ecommerceTitle": "E-commerce API",
    "projects.ecommerceDesc": "REST API for e-commerce platform",
    "projects.dashboardTitle": "Analytics Dashboard",
    "projects.dashboardDesc": "Control panel for business data analysis",
    "projects.characteristics": "Features:",
    "projects.technologies": "Technologies:",
    "projects.technologiesUsed": "Technologies Used:",
    "projects.otherProjects": "Other Projects",
    "projects.visitSite": "Visit Site",
    "projects.viewDetails": "View Details",
    
    // Contact Section
    "contact.title": "Contact Me",
    "contact.subtitle": "Have a project in mind? Let's talk!",
    "contact.description": "I'm always interested in new opportunities and challenging projects. Don't hesitate to contact me.",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    "contact.success": "Message sent successfully!",
    "contact.error": "Error sending message. Please try again.",
    "contact.phone": "Phone",
    "contact.location": "Location",
    "contact.website": "Website",
    "contact.availability": "Availability",
    "contact.freelanceProjects": "Freelance Projects",
    "contact.awsConsulting": "AWS Consulting",
    "contact.erpDevelopment": "ERP Development", 
    "contact.fullTime": "Full Time",
    "contact.available": "Available",
    "contact.considering": "Considering",
    "contact.contactInfo": "Contact Information",
    "contact.messageSentTitle": "Message sent!",
    "contact.messageSentDesc": "I'll contact you soon. Thanks for your interest.",
    "contact.errorSendingTitle": "Error sending message",
    "contact.errorSendingDesc": "There was a problem sending your message. Please try again later.",
    "contact.connectionErrorTitle": "Connection error",
    "contact.connectionErrorDesc": "Could not connect to the server. Check your connection and try again.",
    "contact.sendMessage": "Send me a Message",
    "contact.fullName": "Full Name",
    "contact.fullNamePlaceholder": "Your full name",
    "contact.emailPlaceholder": "your@email.com",
    "contact.selectSubject": "Select a subject",
    "contact.messagePlaceholder": "Describe your project or inquiry...",
    "contact.softwareDev": "Software Development",
    "contact.awsConsultancy": "AWS Consulting",
    "contact.erpSystem": "ERP System",
    "contact.freelanceProject": "Freelance Project",
    "contact.jobOpportunity": "Job Opportunity",
    "contact.other": "Other",
    "contact.downloadCV": "Download my CV",
    "contact.downloadCVDesc": "Get a complete copy of my curriculum vitae",
    "contact.defaultSubject": "Contact from portfolio",
    "contact.emailClientTitle": "Email client opened",
    "contact.emailClientDesc": "Your default email client has been opened with the prepared message.",
    
    // Footer
    "footer.description": "Software developer specialized in Backend solutions with Java, Python and AWS. Creating scalable systems that drive business growth.",
    "footer.rights": "All rights reserved.",
    "footer.developedWith": "Developed with",
    "footer.modernTech": "using modern technologies",
  },
};
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "es" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
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
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("portfolio-language");
    return (saved as Language) || "es";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("portfolio-language", lang);
  };

  const t = (key: string): string => {
    const translation = translations[language] as Record<string, string>;
    return translation[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
    "education.businessInformatics": "Bachelor in Business Informatics",
    "education.internationalBaccalaureate": "International Baccalaureate Diploma Programme",
    "education.mediaEducation": "Bachelor in Media Education",
    
    // Projects Section
    "projects.title": "Featured Projects",
    "projects.viewProject": "View Project",
    "projects.enterIvois": "Enter IVOIS",
    
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
    
    // Footer
    "footer.description": "Software developer specialized in Backend solutions with Java, Python and AWS. Creating scalable systems that drive business growth.",
    "footer.rights": "All rights reserved.",
    "footer.developedWith": "Developed with",
    "footer.modernTech": "using modern technologies",
  },
};
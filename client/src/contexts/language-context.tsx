import {createContext, useContext, useState, useEffect, ReactNode, useMemo} from "react";
import {useLocation} from "wouter";

export type Language = "es" | "en";
export type Section = "home" | "about" | "skills" | "experience" | "education" | "projects" | "contact";

export interface CVData {
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
  additionalTraining: Array<{
    name: string;
    institution: string;
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

type LanguageContextType = {
    language: Language;
    currentSection: Section | null;
    cvData: CVData;
    setLanguage: (lang: Language) => void;
    navigateToSection: (section: Section, updateUrl?: boolean) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

type LanguageProviderProps = {
    children: ReactNode;
};

export function LanguageProvider({children}: LanguageProviderProps) {
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
                window.scrollTo({top: currentScrollY, behavior: 'instant'});
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

    const cvData: CVData = useMemo(() => ({
        personalInfo: {
            name: 'José Pablo Campos Solano',
            title: t('hero.title'),
            email: 'chepelcr@outlook.com',
            phone: '(506) 7039-1069',
            location: 'Costa Rica',
            languages: t('about.languageProficiency')
        },
        about: t('about.description'),
        experience: [
            {
                title: t('experience.professionalServicesTitle'),
                company: t('experience.professionalServicesCompany'),
                period: t('experience.professionalServicesPeriod'),
                description: t('experience.professionalServicesDesc'),
                skills: ['Python 3.12', 'Java 17', 'Spring Boot', 'AWS Lambda', 'CloudFormation', 'SAM', 'SQLAlchemy', 'Pydantic', 'PostgreSQL', 'Redis', 'SQS', 'EventBridge', 'Docker', 'CI/CD', 'Microservices']
            },
            {
                title: t('experience.javaDevTitle'),
                company: t('experience.javaDevCompany'),
                period: t('experience.javaDevPeriod'),
                description: t('experience.javaDevDesc'),
                skills: ['Java', 'Spring Boot', 'Python', 'FastAPI', 'SQLAlchemy', 'Node.js', 'AWS', 'CloudFormation', 'SAM', 'Bash', 'Microservices', 'XML', 'PostgreSQL', 'API Gateway', 'Lambda', 'SES', 'SNS', 'SQS']
            },
            {
                title: t('experience.webDevTitle'),
                company: t('experience.webDevCompany'),
                period: t('experience.webDevPeriod'),
                description: t('experience.webDevDesc'),
                skills: ['PHP', 'React', 'Node.js', 'Python', 'AWS Lambda', 'Excel Macros']
            }
        ],
        education: [
            {
                degree: t('education.businessInformatics'),
                institution: 'Universidad de Costa Rica, Sede del Pacífico',
                period: '2017 - 2022'
            },
            {
                degree: t('education.internationalBaccalaureate'),
                institution: 'Liceo de Costa Rica',
                period: '2015 - 2016'
            },
            {
                degree: t('education.mediaEducation'),
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
        additionalTraining: [
            {
                name: 'CCNAv7: Introduction to networks',
                institution: language === 'es' ? 'Academia de Tecnología UCR' : 'UCR Technology Academy',
                date: ''
            },
            {
                name: 'NDG Linux I',
                institution: language === 'es' ? 'Academia de Tecnología UCR' : 'UCR Technology Academy',
                date: ''
            },
            {
                name: language === 'es' ? 'PHP – Facturación Electrónica – Hacienda' : 'PHP – Electronic Billing – Hacienda',
                institution: language === 'es' ? 'Centro Comunitario Miramar' : 'Miramar Community Center',
                date: ''
            },
            {
                name: language === 'es' ? 'Inteligencia Artificial' : 'Artificial Intelligence',
                institution: language === 'es' ? 'Centro Comunitario Miramar' : 'Miramar Community Center',
                date: ''
            },
            {
                name: language === 'es' ? 'Excel Avanzado' : 'Advanced Excel',
                institution: language === 'es' ? 'Centro Comunitario Miramar' : 'Miramar Community Center',
                date: ''
            },
            {
                name: 'AWS Cloud Practitioner Essentials',
                institution: 'AWS Skill Builder',
                date: ''
            },
            {
                name: 'AWS Security Fundamentals',
                institution: 'AWS Skill Builder',
                date: ''
            },
            {
                name: 'AWS Well-Architected Best Practices',
                institution: 'AWS Skill Builder',
                date: ''
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
                name: t('projects.erpTitle'),
                description: t('projects.erpDesc'),
                technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS', 'Microservices']
            },
            {
                name: t('projects.videoTranscriptTitle'),
                description: t('projects.videoTranscriptDesc'),
                technologies: ['React', 'TypeScript', 'AI Services', 'Web APIs']
            },
            {
                name: t('projects.linuxTitle'),
                description: t('projects.linuxDesc'),
                technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js']
            }
        ]
    }), [language, t]);

    return (
        <LanguageContext.Provider value={{language, currentSection, cvData, setLanguage, navigateToSection, t}}>
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
        "hero.title": "Arquitecto de Soluciones",
        "hero.subtitle": "BackEnd Developer",
        "hero.description": "Desarrollador de software especializado en soluciones Backend con Java, Python y AWS. Creando sistemas escalables que impulsan el crecimiento empresarial.",
        "hero.contactMe": "Contáctame",
        "hero.downloadCV": "Descargar CV",

        // About Section
        "about.title": "Acerca de Mí",
        "about.description": "Soy un desarrollador de software con experiencia en tecnologías serverless, especializado en Java con Spring Boot y Python. Mi pasión por la tecnología me ha llevado a obtener certificaciones en AWS, Microsoft Azure y Cisco, lo que me permite diseñar y desarrollar soluciones escalables en la nube.",
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
        "about.profileDesc1": "Arquitecto de Soluciones, especializado en BackEnd con Java (Spring Boot), Python y Amazon Web Services.",
        "about.profileDesc3": "Me encuentro en mejora continua de mi ERP para facturación electrónica, integrando APIs, mensajería asíncrona y servicios de AWS.",
        "about.profileDesc2": "He participado en comunidades de software de código abierto como Firefox y Drupal Camp y asisto activamente a eventos de tecnología. Me apasiona construir soluciones escalables y limpias enfocadas en generar un impacto real en los procesos de negocio.",

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
        "skills.expert": "Experto",
        "skills.advanced": "Avanzado",
        "skills.intermediate": "Intermedio",
        "skills.basic": "Básico",
        "skills.certified": "Certificado",
        "cv.technologies": "Tecnologías:",
        "cv.page": "Página",

        // Experience Section
        "experience.title": "Experiencia Profesional",
        "experience.current": "Actual",
        "experience.professionalServicesTitle": "Ingeniero de Software",
        "experience.professionalServicesCompany": "Interfaz - Servicios Profesionales",
        "experience.professionalServicesPeriod": "Julio 2025 - Diciembre 2025",
        "experience.professionalServicesDesc": "Migración empresarial de 17 microservicios desde Java Spring Boot (ECS) a arquitectura serverless Python (AWS Lambda), transformando 2,142 archivos Java con más de 1.2M líneas de código." +
            "\nCreación de plantilla de estandarización con guía de migración de 648 líneas, estableciendo patrones reutilizables que redujeron tiempo de migración 40-50%." +
            "\nImplementación de arquitectura serverless con procesamiento dirigido por eventos usando SQS, EventBridge y patrón dual Lambda (HTTP + procesamiento asíncrono)." +
            "\nDesarrollo de infraestructura como código usando CloudFormation y SAM templates con pipelines CI/CD automatizados (CodePipeline, CodeBuild)." +
            "\nTransformación de 170+ DTOs con Pydantic, 33+ mapeadores de datos complejos y 211+ reglas de validación para sistema de cumplimiento tributario." +
            "\nOptimización de costos (70-80% reducción) mediante arquitectura serverless y ARM64, con Redis caching reduciendo carga de base de datos 40-60%." +
            "\nUtilización de herramientas de desarrollo asistido por IA (AWS Amazon Q, Claude Code) para acelerar transformación de código y generación de infraestructura.",
        "experience.javaDevTitle": "Java Developer",
        "experience.javaDevCompany": "Interfaz",
        "experience.javaDevPeriod": "Julio 2022 - Junio 2025",
        "experience.javaDevDesc": "Analisis, diseño e implementación de infraestructura, microservicios, APIs en la nube, servicios de mensajeria, correo y almacenamiento de datos en Amazon Web Services. " +
            "\nGeneración y firma de documentos electrónicos XML correspondientes con el formato requerido por el Ministerio de Hacienda." +
            "\nGestión de sucursales, terminales y numeración consecutiva para documentos electrónicos." +
            "\nGestión avanzada de productos con impuestos específicos, clientes y proveedores enfocado en multiples organizaciones." +
            "\nImportación de datos preexistentes de documentos electrónicos (XML) generados en otros sistemas." +
            "\nIntegración con servicios web del Ministerio de Hacienda: Personas, exoneraciones, codigos CABYS, tipo de cambio del dolar.",
        "experience.javaDevDesc2": "Uso de APIs del Ministerio de Hacienda: Solicitudes de Histórico (documentos y sucursales), envio y validación de documentos electrónicos para multiples negocios." +
            "\nCreación de infraestructura AWS como código utilizando AWS CloudFormation y plantillas SAM, usando archivos bash para despliegue en diferentes etapas y cuentas.",
        "experience.webDevTitle": "Web Developer Ad Honorem",
        "experience.webDevCompany": "Modas Laura",
        "experience.webDevPeriod": "2021 - Actual",
        "experience.webDevDesc": "Desarrollo de sistema de facturación electrónica inicialmente con PHP y posteriormente migrado a React con Node.js e interconexión a API externa." +
            "\nGestión integral de clientes, productos y facturación electrónica cumpliendo con normativas del Ministerio de Hacienda." +
            "\nAutomatización de procesos manuales de creación de Excel mediante macros y posteriormente mediante Python en funciones Lambda." +
            "\nImplementación de arquitectura moderna con frontend React y backend Node.js para mejorar la experiencia de usuario y escalabilidad del sistema.",

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
        "projects.enterERP": "Entrar",
        "projects.erpTitle": "Sistema ERP para Facturación Electrónica",
        "projects.erpDesc": "Sistema integral de gestión empresarial desarrollado con arquitectura de microservicios. Incluye facturación electrónica integrada con IVOIS, gestión de inventario y reportes básicos.",
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
        "projects.viewAllProjects": "Ver Todos los Proyectos",

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

        // Common
        "common.back": "Volver",

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
        "hero.title": "Solutions Architect",
        "hero.subtitle": "BackEnd developer",
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
        "about.profileDesc1": "Solutions Architect, specialized in BackEnd with Java (Spring Boot), Python and Amazon Web Services.",
        "about.profileDesc3": "I am continuously improving my ERP for electronic invoicing, integrating APIs, asynchronous messaging and AWS services.",
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
        "skills.expert": "Expert",
        "skills.advanced": "Advanced",
        "skills.intermediate": "Intermediate",
        "skills.basic": "Basic",
        "skills.certified": "Certified",
        "cv.technologies": "Technologies:",
        "cv.page": "Page",

        // Experience Section
        "experience.title": "Professional Experience",
        "experience.current": "Current",
        "experience.professionalServicesTitle": "Software Engineer",
        "experience.professionalServicesCompany": "Interfaz - Professional Services",
        "experience.professionalServicesPeriod": "July 2025 - December 2025",
        "experience.professionalServicesDesc": "Enterprise migration of 17 microservices from Java Spring Boot (ECS) to Python serverless architecture (AWS Lambda), transforming 2,142 Java files with over 1.2M lines of code." +
            "\nCreation of standardization template with 648-line migration guide, establishing reusable patterns that reduced migration time by 40-50%." +
            "\nImplementation of serverless architecture with event-driven processing using SQS, EventBridge, and dual Lambda pattern (HTTP + asynchronous processing)." +
            "\nDevelopment of Infrastructure as Code using CloudFormation and SAM templates with automated CI/CD pipelines (CodePipeline, CodeBuild)." +
            "\nTransformation of 170+ Pydantic DTOs, 33+ complex data mappers, and 211+ validation rules for tax compliance system." +
            "\nCost optimization (70-80% reduction) through serverless architecture and ARM64, with Redis caching reducing database load by 40-60%." +
            "\nUtilization of AI-assisted development tools (AWS Amazon Q, Claude Code) to accelerate code transformation and infrastructure generation.",
        "experience.javaDevTitle": "Java Developer",
        "experience.javaDevCompany": "Interfaz",
        "experience.javaDevPeriod": "July 2022 - June 2025",
        "experience.javaDevDesc": "Analysis, design and implementation of infrastructure, microservices, cloud APIs, messaging services, email and data storage in Amazon Web Services." +
            "\nGeneration and signing of XML electronic documents corresponding to the format required by the 'Ministerio de Hacienda'." +
            "\nManagement of branches, terminals and consecutive numbering for electronic documents." +
            "\nAdvanced management of products with specific taxes, customers and suppliers focused on multiple organizations." +
            "\nImporting pre-existing data from electronic documents (XML) generated in other systems." +
            "\nIntegration with 'Ministerio de Hacienda' web services: Persons, exemptions, CABYS codes, dollar exchange rate.",
        "experience.javaDevDesc2": "Use of 'Ministerio de Hacienda' APIs: Historical requests (documents and branches), sending and validation of electronic documents for multiple businesses." +
            "\nCreation of AWS infrastructure as code using AWS CloudFormation and SAM templates, using bash files for deployment across different stages and accounts.",
        "experience.webDevTitle": "Web Developer Ad Honorem",
        "experience.webDevCompany": "Modas Laura",
        "experience.webDevPeriod": "2021 - Current",
        "experience.webDevDesc": "Development of electronic invoicing system initially with PHP and later migrated to React with Node.js and external API integration." +
            "\nComprehensive management of clients, products and electronic invoicing complying with Ministry of Finance regulations." +
            "\nAutomation of manual Excel creation processes through macros and later through Python in Lambda functions." +
            "\nImplementation of modern architecture with React frontend and Node.js backend to improve user experience and system scalability.",

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
        "projects.enterERP": "Enter",
        "projects.erpTitle": "ERP System for Electronic Invoicing",
        "projects.erpDesc": "Comprehensive business management system developed with microservices architecture. Includes electronic invoicing integrated with IVOIS, inventory management and basic reporting.",
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
        "projects.viewAllProjects": "View All Projects",
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

        // Common
        "common.back": "Back",

        // Footer
        "footer.description": "Software developer specialized in Backend solutions with Java, Python and AWS. Creating scalable systems that drive business growth.",
        "footer.rights": "All rights reserved.",
        "footer.developedWith": "Developed with",
        "footer.modernTech": "using modern technologies",
    },
};
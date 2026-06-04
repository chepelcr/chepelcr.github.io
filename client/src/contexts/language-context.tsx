import {createContext, useContext, useState, useEffect, ReactNode, useMemo} from "react";
import {useLocation} from "wouter";
import {buildCvData, type CVData} from "@/services/cv.service";
import esTranslations from "@/translations/es.json";
import enTranslations from "@/translations/en.json";

export type Language = "es" | "en";
export type Section = "home" | "about" | "skills" | "experience" | "education" | "projects" | "contact";

export type {CVData};

const translations = {
    es: esTranslations,
    en: enTranslations,
};

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

        // Inside the admin panel there is no language-prefixed URL to navigate to
        // (routes are /admin/*), so switch the working language in place — no
        // page animation, no navigation that would kick us out of /admin.
        if (location.startsWith("/admin")) {
            setLanguageState(lang);
            localStorage.setItem("portfolio-language", lang);
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

    const cvData: CVData = useMemo(() => buildCvData(language, t), [language, t]);

    return (
        <LanguageContext.Provider value={{language, currentSection, cvData, setLanguage, navigateToSection, t}}>
            {children}
        </LanguageContext.Provider>
    );
}

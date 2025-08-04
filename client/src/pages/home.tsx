import { useEffect } from "react";
import { useParams } from "wouter";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import SkillsSection from "@/components/skills-section";
import ExperienceSection from "@/components/experience-section";
import EducationSection from "@/components/education-section";
import ProjectsSection from "@/components/projects-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { useLanguage, type Section } from "@/contexts/language-context";

export default function Home() {
  const params = useParams();
  const { language } = useLanguage();

  // Handle direct URL navigation
  useEffect(() => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const targetSection = pathParts[1]; // section from URL
    
    if (targetSection && targetSection !== "home") {
      const scrollToTarget = () => {
        const element = document.getElementById(targetSection);
        if (element) {
          // Wait a bit for page to settle, then scroll
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      };
      
      // Try multiple times to ensure it works
      scrollToTarget();
      setTimeout(scrollToTarget, 300);
      setTimeout(scrollToTarget, 600);
    }
  }, [window.location.pathname]);

  // Simple, reliable scroll spy
  useEffect(() => {
    let ticking = false;
    
    const updateURL = () => {
      if (ticking) return;
      ticking = true;
      
      requestAnimationFrame(() => {
        const sections = ["home", "about", "skills", "experience", "education", "projects", "contact"];
        const scrollPosition = window.scrollY + 150; // Account for fixed nav
        
        let currentSection = "home";
        
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = window.scrollY + rect.top;
            
            if (scrollPosition >= elementTop) {
              currentSection = sectionId;
            }
          }
        }
        
        const expectedPath = currentSection === "home" ? `/${language}` : `/${language}/${currentSection}`;
        if (window.location.pathname !== expectedPath) {
          window.history.replaceState({}, '', expectedPath);
        }
        
        ticking = false;
      });
    };

    window.addEventListener('scroll', updateURL, { passive: true });
    return () => window.removeEventListener('scroll', updateURL);
  }, [language]);

  return (
    <div className="min-h-screen bg-navy text-foreground">
      <Navigation />
      <div id="home">
        <HeroSection />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="skills">
        <SkillsSection />
      </div>
      <div id="experience">
        <ExperienceSection />
      </div>
      <div id="education">
        <EducationSection />
      </div>
      <div id="projects">
        <ProjectsSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
}

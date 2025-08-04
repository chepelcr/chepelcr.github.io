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
  const { currentSection, language } = useLanguage();

  // Handle direct URL navigation on page load
  useEffect(() => {
    const urlParams = params as { section?: string };
    const targetSection = urlParams.section;
    
    if (targetSection && targetSection !== "home") {
      // Multiple attempts to ensure scrolling works
      const scrollToSection = () => {
        const element = document.querySelector(`#${targetSection}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          return true;
        }
        return false;
      };
      
      // Try immediately
      if (!scrollToSection()) {
        // Try after 500ms
        const timer1 = setTimeout(() => {
          if (!scrollToSection()) {
            // Try after 1000ms
            setTimeout(scrollToSection, 500);
          }
        }, 500);
        return () => clearTimeout(timer1);
      }
    }
  }, [params]);

  // Improved scroll spy for URL updates
  useEffect(() => {
    const sections: Section[] = ["home", "about", "skills", "experience", "education", "projects", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all visible sections
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => ({
            id: entry.target.id as Section,
            ratio: entry.intersectionRatio,
            boundingRect: entry.boundingClientRect
          }))
          .sort((a, b) => {
            // Prioritize sections closer to the top of viewport
            const aDistance = Math.abs(a.boundingRect.top);
            const bDistance = Math.abs(b.boundingRect.top);
            return aDistance - bDistance;
          });

        if (visibleSections.length > 0) {
          const currentSection = visibleSections[0].id;
          const expectedPath = currentSection === "home" ? `/${language}` : `/${language}/${currentSection}`;
          
          if (window.location.pathname !== expectedPath) {
            window.history.replaceState({}, '', expectedPath);
          }
        }
      },
      {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: '-80px 0px -50% 0px'
      }
    );

    // Observe all sections
    sections.forEach(sectionId => {
      const element = document.querySelector(`#${sectionId}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
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

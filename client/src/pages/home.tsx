import { useEffect, useState } from "react";
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
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false);
  const [scrollSpyEnabled, setScrollSpyEnabled] = useState(false);

  // Handle initial scroll on page load with direct URL
  useEffect(() => {
    if (currentSection && !hasInitiallyScrolled) {
      const timer = setTimeout(() => {
        if (currentSection !== "home") {
          const element = document.querySelector(`#${currentSection}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
        setHasInitiallyScrolled(true);
        // Enable scroll spy after initial navigation is complete
        setTimeout(() => setScrollSpyEnabled(true), 2000);
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (hasInitiallyScrolled && !scrollSpyEnabled) {
      // Enable scroll spy if we've already handled initial load
      const timer = setTimeout(() => setScrollSpyEnabled(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentSection, hasInitiallyScrolled, scrollSpyEnabled]);

  // Only update URL based on scroll position when scroll spy is enabled
  useEffect(() => {
    if (!scrollSpyEnabled) return;

    const sections: Section[] = ["home", "about", "skills", "experience", "education", "projects", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        const visibleSections = entries
          .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0.5)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          const section = visibleSections[0].target.id as Section;
          const expectedPath = section === "home" ? `/${language}` : `/${language}/${section}`;
          
          if (window.location.pathname !== expectedPath) {
            window.history.replaceState({}, '', expectedPath);
          }
        }
      },
      {
        threshold: [0.5, 0.7],
        rootMargin: '-120px 0px -40% 0px'
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
  }, [language, scrollSpyEnabled]);

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

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
    const targetSection = urlParams.section || currentSection;
    
    if (targetSection && targetSection !== "home") {
      const timer = setTimeout(() => {
        const element = document.querySelector(`#${targetSection}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [params, currentSection]);

  // Simple scroll spy for URL updates only
  useEffect(() => {
    const sections: Section[] = ["home", "about", "skills", "experience", "education", "projects", "contact"];
    let isScrolling = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return;
        
        const visibleSections = entries
          .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0.4)
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
        threshold: [0.4, 0.6],
        rootMargin: '-80px 0px -40% 0px'
      }
    );

    // Track scrolling to prevent conflicts
    const handleScroll = () => {
      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 150);
    };

    window.addEventListener('scroll', handleScroll);

    sections.forEach(sectionId => {
      const element = document.querySelector(`#${sectionId}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
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

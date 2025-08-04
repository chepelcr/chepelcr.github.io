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

  // Scroll to section when current section changes
  useEffect(() => {
    if (currentSection) {
      const timer = setTimeout(() => {
        const element = document.querySelector(`#${currentSection}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentSection]);

  // Simple scroll spy to update URL based on scroll position
  useEffect(() => {
    const sections: Section[] = ["home", "about", "skills", "experience", "education", "projects", "contact"];
    let isScrollingProgrammatically = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingProgrammatically) return;

        // Find the most visible section
        const visibleSections = entries
          .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0.6)
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
        threshold: [0.6, 0.8],
        rootMargin: '-100px 0px -30% 0px'
      }
    );

    // Observe all sections
    sections.forEach(sectionId => {
      const element = document.querySelector(`#${sectionId}`);
      if (element) {
        observer.observe(element);
      }
    });

    // Disable scroll spy during programmatic scrolling
    const handleScrollStart = () => {
      isScrollingProgrammatically = true;
      setTimeout(() => {
        isScrollingProgrammatically = false;
      }, 2000);
    };

    // Listen for section changes to disable scroll spy temporarily
    if (currentSection) {
      handleScrollStart();
    }

    return () => observer.disconnect();
  }, [language, currentSection]);

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

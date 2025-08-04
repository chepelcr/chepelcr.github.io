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
import { useLanguage } from "@/contexts/language-context";

export default function Home() {
  const params = useParams();
  const { currentSection } = useLanguage();

  // Scroll to section when URL contains a section
  useEffect(() => {
    if (currentSection && currentSection !== "home") {
      const timer = setTimeout(() => {
        const element = document.querySelector(`#${currentSection}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentSection]);

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

import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { type Section } from "@/contexts/language-context";

interface UseScrollSpyProps {
  language: string;
  currentSection: Section | null;
}

export function useScrollSpy({ language, currentSection }: UseScrollSpyProps) {
  const [location, navigate] = useLocation();
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const sections: Section[] = ["home", "about", "skills", "experience", "education", "projects", "contact"];
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        // Find the section that's most visible and above the fold
        const visibleSections = entries
          .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0.5)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          const section = visibleSections[0].target.id as Section;
          const expectedPath = section === "home" ? `/${language}` : `/${language}/${section}`;
          
          if (location !== expectedPath) {
            // Use replaceState to avoid adding to browser history
            window.history.replaceState({}, '', expectedPath);
          }
        }
      },
      {
        threshold: [0.5, 0.7], // Reduced thresholds, section needs to be at least 50% visible
        rootMargin: '-100px 0px -40% 0px' // More conservative margins
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
  }, [language, location]);

  // Function to disable scroll tracking temporarily during programmatic scrolling
  const setScrolling = (isScrolling: boolean) => {
    isScrollingRef.current = isScrolling;
    if (isScrolling) {
      // Clear any previous timeout
      const timeoutId = setTimeout(() => {
        isScrollingRef.current = false;
      }, 2500); // Longer timeout to ensure smooth scrolling completes
      
      return () => clearTimeout(timeoutId);
    }
  };

  return { setScrolling };
}
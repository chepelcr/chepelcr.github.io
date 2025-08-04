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
        // Find the most visible section
        let mostVisibleEntry = entries.reduce((max, entry) => 
          entry.intersectionRatio > max.intersectionRatio ? entry : max
        );

        if (mostVisibleEntry.isIntersecting && !isScrollingRef.current) {
          const section = mostVisibleEntry.target.id as Section;
          const expectedPath = section === "home" ? `/${language}` : `/${language}/${section}`;
          
          if (location !== expectedPath) {
            // Use replaceState to avoid adding to browser history
            window.history.replaceState({}, '', expectedPath);
          }
        }
      },
      {
        threshold: [0.3, 0.6, 0.9], // Multiple thresholds for better detection
        rootMargin: '-80px 0px -50% 0px' // Account for navbar and focus on top half
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
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1500);
    }
  };

  return { setScrolling };
}
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const navigationItems = [
    { href: "#home", label: t("nav.home") },
    { href: "#about", label: t("nav.about") },
    { href: "#skills", label: t("nav.skills") },
    { href: "#experience", label: t("nav.experience") },
    { href: "#education", label: t("nav.education") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-navy/95 backdrop-blur-sm border-b border-border" : ""
      }`}
    >
      <div className="container-spacing">
        <div className="flex justify-between items-center py-4">
          <div className="text-xl font-bold text-accent">
            José Pablo Campos
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleClick(item.href)}
                className="hover:text-accent transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center space-x-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageToggle />
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleClick(item.href)}
                    className="text-left py-2 hover:text-accent transition-colors text-lg"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
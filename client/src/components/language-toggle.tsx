import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative w-10 h-10 rounded-full border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all duration-300"
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        <DropdownMenuItem 
          onClick={() => setLanguage("es")}
          className={`hover:bg-accent hover:text-accent-foreground cursor-pointer ${
            language === "es" ? "bg-accent text-accent-foreground" : ""
          }`}
        >
          <span className="mr-2">🇪🇸</span>
          <span>Español</span>
          {language === "es" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("en")}
          className={`hover:bg-accent hover:text-accent-foreground cursor-pointer ${
            language === "en" ? "bg-accent text-accent-foreground" : ""
          }`}
        >
          <span className="mr-2">🇺🇸</span>
          <span>English</span>
          {language === "en" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
import { Button } from "@/components/ui/button";
import { Download, Mail, ExternalLink } from "lucide-react";

export default function HeroSection() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="section-spacing gradient-bg pt-32">
      <div className="container-spacing">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              José Pablo{" "}
              <span className="text-accent">Campos Solano</span>
            </h1>
            <h2 className="text-xl lg:text-2xl text-muted-foreground mb-8">
              Software Developer | Backend Specialist | AWS Solutions Architect
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Desarrollador de software especializado en BackEnd con Java (Spring Boot) y Python. 
              Experto en arquitectura de microservicios, servicios cloud con AWS y desarrollo de sistemas ERP.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => handleScroll("contact")}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contactar
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleScroll("projects")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver Proyectos
              </Button>
            </div>
          </div>
          <div className="flex-1 max-w-md lg:max-w-lg">
            <img
              src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Modern software developer workspace"
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
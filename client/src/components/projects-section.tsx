import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Laptop, 
  Eye, 
  Github, 
  ExternalLink, 
  Info, 
  Bot, 
  ShoppingCart, 
  TrendingUp 
} from "lucide-react";

const mainProjects = [
  {
    title: "Sistema ERP para Facturación Electrónica",
    description: "Sistema integral de gestión empresarial desarrollado con arquitectura de microservicios. Incluye facturación electrónica integrada con el Ministerio de Hacienda de Costa Rica, gestión de inventario, reportes avanzados y API REST para integraciones.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: ["Java Spring Boot", "Python", "AWS Services", "PostgreSQL", "Docker", "Kafka"],
    type: "ERP System",
  },
  {
    title: "Sitio Web de Comandos Linux",
    description: "Plataforma educativa interactiva para aprender comandos básicos de Linux. Incluye conceptos fundamentales, ejemplos prácticos, herramientas de administración y utilidades para desarrolladores y administradores de sistemas.",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    type: "Educational Platform",
    liveUrl: "https://jcampos.dev/Comandos-linux/",
    features: [
      "Interface interactiva y responsive",
      "Ejemplos de comandos categorizados",
      "Guías de seguridad informática",
      "Herramientas de administración",
    ],
  },
];

const otherProjects = [
  {
    title: "Microservicio de Inteligencia Artificial",
    description: "Servicio de procesamiento de datos con algoritmos de ML",
    icon: Bot,
  },
  {
    title: "E-commerce API",
    description: "API REST para plataforma de comercio electrónico",
    icon: ShoppingCart,
  },
  {
    title: "Dashboard de Analytics",
    description: "Panel de control para análisis de datos empresariales",
    icon: TrendingUp,
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-spacing bg-slate">
      <div className="container-spacing">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
          <Laptop className="inline-block text-accent mr-4" />
          Proyectos Destacados
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {mainProjects.map((project, index) => (
            <Card key={index} className="bg-card border-border card-hover">
              <CardContent className="p-8">
                <div className="mb-6">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-accent">
                  {project.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {project.description}
                </p>
                
                {project.features && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Características:</h4>
                    <ul className="text-muted-foreground space-y-2">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <span className="text-accent mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">
                    {project.features ? "Tecnologías:" : "Tecnologías Utilizadas:"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} className="bg-accent text-accent-foreground">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {project.liveUrl ? (
                    <Button 
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => window.open(project.liveUrl, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visitar Sitio
                    </Button>
                  ) : (
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalles
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    {project.liveUrl ? (
                      <><Info className="mr-2 h-4 w-4" />Más Info</>
                    ) : (
                      <><Github className="mr-2 h-4 w-4" />Código Fuente</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Projects Preview */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-8 text-accent">Otros Proyectos</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <Card key={index} className="bg-card border-border card-hover">
                <CardContent className="p-6 text-center">
                  <project.icon className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">{project.title}</h4>
                  <p className="text-muted-foreground text-sm">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
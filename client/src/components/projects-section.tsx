import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
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

const getMainProjects = (t: any, language: string) => [
  {
    title: t("projects.erpTitle"),
    description: t("projects.erpDesc"),
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: ["Java Spring Boot", "Python", "AWS Services", "PostgreSQL", "Docker", "Kafka"],
    type: "ERP System",
    ivoiUrl: "https://frontend.dev.ivois.io",
  },
  {
    title: t("projects.videoTranscriptTitle"),
    description: t("projects.videoTranscriptDesc"),
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: ["React", "TypeScript", "AI Services", "Web APIs", "Tailwind CSS"],
    type: "AI Tool",
    liveUrl: `https://jcampos.dev/video-transcript/${language}`,
    features: [
      t("projects.videoFeature1"),
      t("projects.videoFeature2"),
      t("projects.videoFeature3"),
      t("projects.videoFeature4"),
    ],
  },
  {
    title: t("projects.linuxTitle"),
    description: t("projects.linuxDesc"),
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    type: "Educational Platform",
    liveUrl: "https://jcampos.dev/Comandos-linux/",
    features: [
      t("projects.feature1"),
      t("projects.feature2"),
      t("projects.feature3"),
      t("projects.feature4"),
    ],
  },
];

const getOtherProjects = (t: any) => [
  {
    title: t("projects.ecommerceTitle"),
    description: t("projects.ecommerceDesc"),
    icon: ShoppingCart,
  },
  {
    title: t("projects.dashboardTitle"),
    description: t("projects.dashboardDesc"),
    icon: TrendingUp,
  },
];

export default function ProjectsSection() {
  const { t, language } = useLanguage();
  const mainProjects = getMainProjects(t, language);
  const otherProjects = getOtherProjects(t);
  
  return (
    <section id="projects" className="section-spacing bg-slate">
      <div className="container-spacing">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
          <Laptop className="inline-block text-accent mr-4" />
          {t("projects.title")}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mainProjects.map((project, index) => (
            <Card key={index} className="bg-card border-border card-hover h-full">
              <CardContent className="p-8 h-full flex flex-col">
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
                    <h4 className="font-semibold mb-3">{t("projects.characteristics")}</h4>
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
                
                <div className="mb-6 flex-grow">
                  <h4 className="font-semibold mb-3">
                    {project.features ? t("projects.technologies") : t("projects.technologiesUsed")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} className="bg-accent text-accent-foreground">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  {project.ivoiUrl ? (
                    <Button 
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => window.open(project.ivoiUrl, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t("projects.enterIvois")}
                    </Button>
                  ) : project.liveUrl ? (
                    <Button 
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => window.open(project.liveUrl, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t("projects.visitSite")}
                    </Button>
                  ) : (
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Eye className="mr-2 h-4 w-4" />
                      {t("projects.viewDetails")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Projects Preview */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-8 text-accent">{t("projects.otherProjects")}</h3>
          <div className="grid md:grid-cols-2 gap-6">
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
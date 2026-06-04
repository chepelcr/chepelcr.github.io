import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { getFeatured, getOther } from "@/services/projects.service";
import { pickLang } from "@/lib/i18n-field";
import { parseRichText } from "@/lib/rich-text";
import { resolveIcon } from "@/lib/icons";
import { resolveAssetUrl } from "@/lib/media";
import {
  Laptop,
  Lock,
  ExternalLink,
} from "lucide-react";

export default function ProjectsSection() {
  const { t, language, navigateToSection } = useLanguage();
  const mainProjects = getFeatured();
  const otherProjects = getOther();

  const handleRequestAccess = () => {
    navigateToSection("contact");
  };

  return (
    <section id="projects" className="section-spacing bg-slate">
      <div className="container-spacing">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
          <Laptop className="inline-block text-accent mr-4" />
          {t("projects.title")}
        </h2>

        {/* Beauty Market SaaS - Full Width Row */}
        <div className="mb-12">
          <Card className="bg-card border-border card-hover h-full">
            <CardContent className="p-8 h-full flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <img
                  src={resolveAssetUrl(mainProjects[0].image)}
                  alt={pickLang(mainProjects[0].title, language)}
                  className="rounded-lg w-full h-48 lg:h-full object-cover"
                />
              </div>
              <div className="lg:w-2/3 flex flex-col">
                <h3 className="text-2xl font-semibold mb-4 text-accent">
                  {pickLang(mainProjects[0].title, language)}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {parseRichText(pickLang(mainProjects[0].description, language))}
                </p>

                {mainProjects[0].features && mainProjects[0].features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">{t("projects.characteristics")}</h4>
                    <ul className="text-muted-foreground space-y-2">
                      {mainProjects[0].features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <span className="text-accent mr-2">✓</span>
                          {parseRichText(pickLang(feature, language))}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-6 flex-grow">
                  <h4 className="font-semibold mb-3">{t("projects.technologiesUsed")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {mainProjects[0].technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} className="bg-accent text-accent-foreground">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  {mainProjects[0].accessMode === "link" ? (
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      asChild
                    >
                      <a href={mainProjects[0].liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("projects.accessSite")}
                      </a>
                    </Button>
                  ) : (
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={handleRequestAccess}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {t("projects.requestAccess")}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Transcription and Linux Commands - Two Column Row */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {mainProjects.slice(1).map((project, index) => (
            <Card key={index + 1} className="bg-card border-border card-hover h-full">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="mb-6">
                  <img
                    src={resolveAssetUrl(project.image)}
                    alt={pickLang(project.title, language)}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-accent">
                  {pickLang(project.title, language)}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {parseRichText(pickLang(project.description, language))}
                </p>

                {project.features && project.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">{t("projects.characteristics")}</h4>
                    <ul className="text-muted-foreground space-y-2">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <span className="text-accent mr-2">✓</span>
                          {parseRichText(pickLang(feature, language))}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-6 flex-grow">
                  <h4 className="font-semibold mb-3">
                    {project.features && project.features.length > 0 ? t("projects.technologies") : t("projects.technologiesUsed")}
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
                  {project.accessMode === "link" ? (
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      asChild
                    >
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("projects.accessSite")}
                      </a>
                    </Button>
                  ) : (
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={handleRequestAccess}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {t("projects.requestAccess")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Projects Preview */}
        <div className="text-center mt-16">
          <h3 className="text-xl font-semibold mb-8 text-accent">{t("projects.otherProjects")}</h3>
          <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
            {otherProjects.map((project, index) => {
              const ProjectIcon = resolveIcon((project as any).iconName);
              return (
              <Card key={index} className="bg-card border-border card-hover">
                <CardContent className="p-6 text-center">
                  <ProjectIcon className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">{pickLang(project.title, language)}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{parseRichText(pickLang(project.description, language))}</p>
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleRequestAccess}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {t("projects.requestAccess")}
                  </Button>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { Briefcase, Code, Globe, Play } from "lucide-react";

const getExperiences = (t: any) => [
  {
    title: t("experience.webDevTitle"),
    company: t("experience.webDevCompany"),
    period: t("experience.webDevPeriod"),
    description: t("experience.webDevDesc"),
    skills: ["ERP Development", "Electronic Invoicing", "PHP", "MySQL"],
    icon: Globe,
    current: true,
  },
  {
    title: t("experience.javaDevTitle"),
    company: t("experience.javaDevCompany"),
    period: t("experience.javaDevPeriod"),
    description: t("experience.javaDevDesc"),
    skills: ["Java", "AWS", "Microservices", "Spring Boot"],
    icon: Code,
    current: true,
  },
];

export default function ExperienceSection() {
  const { t } = useLanguage();
  const experiences = getExperiences(t);
  
  return (
    <section id="experience" className="section-spacing bg-slate">
      <div className="container-spacing">
        <div className="relative mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-center">
            <Briefcase className="inline-block text-accent mr-4" />
            {t("experience.title")}
          </h2>
          
          {/* Begin circle - aligned with title */}
          <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2">
            <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
              <Play className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div 
            className="absolute left-8 w-0.5 bg-accent hidden md:block" 
            style={{
              top: '-64px',
              height: `calc(100% - 64px)`
            }}
          />
          
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-8">
                  <div className="hidden md:block flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                      <exp.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <Card className="flex-1 bg-card border-border card-hover h-full">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <h3 className="text-xl font-semibold text-accent">{exp.title}</h3>
                        <span className="text-muted-foreground font-mono">{exp.period}</span>
                      </div>
                      <p className="text-lg font-medium mb-2">{exp.company}</p>
                      <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {exp.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} className="bg-accent text-accent-foreground">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
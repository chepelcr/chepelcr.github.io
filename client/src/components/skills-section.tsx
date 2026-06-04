import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { resolveIcon } from "@/lib/icons";
import { getCategories, getSoft } from "@/services/skills.service";
import { Code, Brain } from "lucide-react";

function SkillCard({
  title,
  skills,
  icon: Icon,
}: {
  title: string;
  skills: { name: string; level: string; icon: string }[];
  icon: any;
}) {
  return (
    <Card className="bg-card border-border card-hover">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-6 text-accent flex items-center">
          <Icon className="mr-3" />
          {title}
        </h3>
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-slate p-4 rounded-lg hover:bg-slate/80 transition-colors"
            >
              <span className="font-semibold flex items-center">
                <span className="mr-2">{skill.icon}</span>
                {skill.name}
              </span>
              <Badge className="bg-accent text-accent-foreground">
                {skill.level}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SkillsSection() {
  const { t } = useLanguage();
  const categories = getCategories();
  const softSkills = getSoft();

  return (
    <section id="skills" className="section-spacing bg-navy">
      <div className="container-spacing">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
          <Code className="inline-block text-accent mr-4" />
          {t("skills.title")}
        </h2>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {categories.map((category) => (
            <SkillCard
              key={category.key}
              title={t("skills." + category.key)}
              icon={resolveIcon(category.iconName)}
              skills={category.items.map((item) => ({
                name: item.name,
                level: t("skills." + item.levelToken),
                icon: item.emoji,
              }))}
            />
          ))}
        </div>

        {/* Soft Skills */}
        <Card className="bg-card border-border card-hover">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-8 text-accent text-center">
              <Brain className="inline-block mr-3" />
              {t("skills.softSkills")}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {softSkills.map((skill, index) => {
                const SkillIcon = resolveIcon(skill.iconName);
                return (
                  <div key={index} className="text-center">
                    <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <SkillIcon className="h-8 w-8" />
                    </div>
                    <h4 className="font-semibold mb-2">{t(skill.titleKey)}</h4>
                    <p className="text-muted-foreground text-sm">
                      {t(skill.descKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

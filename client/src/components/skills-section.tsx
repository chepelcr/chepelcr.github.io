import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { 
  Code, 
  Cloud, 
  Database, 
  Settings, 
  Brain, 
  Users, 
  RotateCcw, 
  Rocket 
} from "lucide-react";

const coreSkills = [
  { name: "Java (Spring Boot)", level: "Experto", icon: "☕" },
  { name: "Python", level: "Avanzado", icon: "🐍" },
  { name: "PHP", level: "Intermedio", icon: "🔧" },
  { name: "JavaScript & HTML", level: "Intermedio", icon: "🌐" },
];

const cloudSkills = [
  { name: "AWS Infrastructure", level: "Certificado", icon: "☁️" },
  { name: "Microservices Architecture", level: "Experto", icon: "🏗️" },
  { name: "Serverless Programming", level: "Avanzado", icon: "⚡" },
  { name: "Docker & Container", level: "Avanzado", icon: "🐳" },
];

const databaseSkills = [
  { name: "MySQL", level: "Avanzado", icon: "🗄️" },
  { name: "PostgreSQL", level: "Avanzado", icon: "🐘" },
  { name: "Oracle", level: "Intermedio", icon: "🔶" },
  { name: "Microsoft SQL Server", level: "Intermedio", icon: "🗃️" },
];

const toolsSkills = [
  { name: "Rest API Services", level: "Experto", icon: "🔗" },
  { name: "Linux", level: "Avanzado", icon: "🐧" },
  { name: "Kafka", level: "Intermedio", icon: "📊" },
  { name: "Redis", level: "Intermedio", icon: "⚡" },
];

const softSkills = [
  {
    icon: Brain,
    title: "Pensamiento Analítico",
    description: "Enfoque en resolución de problemas",
  },
  {
    icon: Users,
    title: "Trabajo Colaborativo",
    description: "Comunicación efectiva con equipos multidisciplinarios",
  },
  {
    icon: RotateCcw,
    title: "Adaptabilidad",
    description: "Capacidad de cambio y aprendizaje continuo",
  },
  {
    icon: Rocket,
    title: "Iniciativa",
    description: "Curiosidad por nuevas tecnologías y metodologías",
  },
];

function SkillCard({ title, skills, icon: Icon }: { title: string; skills: any[]; icon: any }) {
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
  
  return (
    <section id="skills" className="section-spacing bg-navy">
      <div className="container-spacing">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
          <Code className="inline-block text-accent mr-4" />
          {t("skills.title")}
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <SkillCard title={t("skills.backend")} skills={coreSkills} icon={Code} />
          <SkillCard title={t("skills.cloud")} skills={cloudSkills} icon={Cloud} />
          <SkillCard title={t("skills.databases")} skills={databaseSkills} icon={Database} />
          <SkillCard title={t("skills.tools")} skills={toolsSkills} icon={Settings} />
        </div>

        {/* Soft Skills */}
        <Card className="bg-card border-border card-hover">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-8 text-accent text-center">
              <Brain className="inline-block mr-3" />
              Habilidades Blandas
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {softSkills.map((skill, index) => (
                <div key={index} className="text-center">
                  <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <skill.icon className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold mb-2">{skill.title}</h4>
                  <p className="text-muted-foreground text-sm">{skill.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
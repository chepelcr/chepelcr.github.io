import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, BookOpen } from "lucide-react";

const education = [
  {
    degree: "Bachiller en Informática Empresarial",
    institution: "Universidad de Costa Rica, Sede del Pacífico",
    period: "2017 - 2022",
  },
  {
    degree: "Programa del Bachillerato Internacional",
    institution: "Liceo de Costa Rica",
    period: "2015 - 2016",
  },
  {
    degree: "Bachiller en Educación Media",
    institution: "Liceo de Costa Rica",
    period: "2010 - 2016",
  },
];

const certifications = [
  {
    name: "AWS Certified Solutions Architect",
    provider: "AWS",
    date: "13-04-2023",
    description: "Certificación de nivel asociado en arquitectura de soluciones AWS",
    badge: "AWS",
  },
  {
    name: "AWS Certified Cloud Practitioner",
    provider: "AWS",
    date: "16-02-2023",
    description: "Certificación fundamental de servicios y conceptos de AWS",
    badge: "AWS",
  },
  {
    name: "Microsoft Certified: Azure Fundamentals",
    provider: "Azure",
    date: "22-03-2023",
    description: "Certificación fundamental de servicios de Microsoft Azure",
    badge: "Azure",
  },
];

const training = [
  {
    institution: "Academia de Tecnología UCR",
    courses: ["CCNAv7: Introduction to networks", "NDG Linux I"],
  },
  {
    institution: "Centro Comunitario Miramar",
    courses: ["PHP – Electronic Billing – Hacienda", "Inteligencia Artificial", "Advanced Excel"],
  },
  {
    institution: "AWS Skill Builder",
    courses: ["AWS Cloud Practitioner Essentials", "AWS Security Fundamentals", "AWS Well-Architected Best Practices"],
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="section-spacing bg-navy">
      <div className="container-spacing">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
          <GraduationCap className="inline-block text-accent mr-4" />
          Educación y Certificaciones
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-accent flex items-center">
              <GraduationCap className="mr-3" />
              Educación
            </h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card key={index} className="bg-card border-border card-hover">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold mb-2">{edu.degree}</h4>
                    <p className="text-accent font-medium mb-2">{edu.institution}</p>
                    <p className="text-muted-foreground font-mono">{edu.period}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-accent flex items-center">
              <Award className="mr-3" />
              Certificaciones
            </h3>
            <div className="space-y-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="bg-card border-border card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">{cert.name}</h4>
                      <Badge className="bg-accent text-accent-foreground">
                        {cert.badge}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground font-mono mb-2">
                      Fecha de activación: {cert.date}
                    </p>
                    <p className="text-muted-foreground text-sm">{cert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Training Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-8 text-accent text-center flex items-center justify-center">
            <BookOpen className="mr-3" />
            Capacitaciones Adicionales
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {training.map((item, index) => (
              <Card key={index} className="bg-card border-border card-hover">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{item.institution}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {item.courses.map((course, courseIndex) => (
                      <li key={courseIndex}>• {course}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
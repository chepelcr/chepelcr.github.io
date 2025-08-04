import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Send, 
  Download,
  Clock
} from "lucide-react";

const getContactInfo = (t: any) => [
  {
    icon: Phone,
    label: t("contact.phone"),
    value: "(506) 7039-1069",
    href: "tel:+50670391069",
  },
  {
    icon: Mail,
    label: "Email",
    value: "chepelcr@outlook.com",
    href: "mailto:chepelcr@outlook.com",
  },
  {
    icon: MapPin,
    label: t("contact.location"),
    value: "Costa Rica",
  },
  {
    icon: Globe,
    label: t("contact.website"),
    value: "jcampos.dev",
    href: "https://jcampos.dev",
  },
];

const getAvailability = (t: any) => [
  { service: t("contact.freelanceProjects"), status: t("contact.available"), color: "bg-green-500" },
  { service: t("contact.awsConsulting"), status: t("contact.available"), color: "bg-green-500" },
  { service: t("contact.erpDevelopment"), status: t("contact.available"), color: "bg-green-500" },
  { service: t("contact.fullTime"), status: t("contact.considering"), color: "bg-yellow-500" },
];

export default function ContactSection() {
  const { t } = useLanguage();
  const contactInfo = getContactInfo(t);
  const availability = getAvailability(t);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast({
          title: t("contact.messageSentTitle"),
          description: t("contact.messageSentDesc"),
        });
        
        // Reset form
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast({
          title: t("contact.errorSendingTitle"),
          description: result.message || t("contact.errorSendingDesc"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: t("contact.connectionErrorTitle"),
        description: t("contact.connectionErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="section-spacing bg-navy">
      <div className="container-spacing">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
          <Mail className="inline-block text-accent mr-4" />
          {t("contact.title")}
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-accent">
                  {t("contact.contactInfo")}
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="bg-accent text-accent-foreground w-12 h-12 rounded-full flex items-center justify-center">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{item.label}</p>
                        {item.href ? (
                          <a 
                            href={item.href}
                            className="text-muted-foreground hover:text-accent transition-colors"
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-accent flex items-center">
                  <Clock className="mr-3" />
                  {t("contact.availability")}
                </h3>
                <div className="space-y-4">
                  {availability.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{item.service}</span>
                      <Badge 
                        className={`${item.color} text-white`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-accent">
                Envíame un Mensaje
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                    className="bg-slate border-border focus:border-accent"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="bg-slate border-border focus:border-accent"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Asunto</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => handleInputChange("subject", value)}
                  >
                    <SelectTrigger className="bg-slate border-border focus:border-accent">
                      <SelectValue placeholder="Selecciona un asunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desarrollo">Desarrollo de Software</SelectItem>
                      <SelectItem value="aws">Consultoría AWS</SelectItem>
                      <SelectItem value="erp">Sistema ERP</SelectItem>
                      <SelectItem value="freelance">Proyecto Freelance</SelectItem>
                      <SelectItem value="laboral">Oportunidad Laboral</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Describe tu proyecto o consulta..."
                    rows={5}
                    required
                    className="bg-slate border-border focus:border-accent resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Download CV Section */}
        <div className="mt-16 text-center">
          <Card className="bg-card border-border inline-block">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4 text-accent">
                Descarga mi CV
              </h3>
              <p className="text-muted-foreground mb-6">
                Obtén una copia completa de mi currículum vitae
              </p>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => {
                  const cvData = {
                    personalInfo: {
                      name: "José Pablo Campos Rivera",
                      email: "chepelcr@outlook.com", 
                      phone: "+506 7039-1069",
                      nationality: "Costa Rica"
                    },
                    education: [
                      {
                        degree: "Bachiller en Informática Empresarial",
                        institution: "Universidad de Costa Rica, Sede del Pacífico",
                        period: "2017 - 2022"
                      }
                    ],
                    certifications: [
                      "AWS Certified Solutions Architect (13-04-2023)",
                      "AWS Certified Cloud Practitioner (16-02-2023)", 
                      "Microsoft Certified: Azure Fundamentals (22-03-2023)",
                      "CCNA: Introduction to Networks (2023)",
                      "EF SET English Certificate - Nivel B2 (2023)"
                    ],
                    skills: [
                      "Java Spring Boot", "Python", "AWS Services", "PostgreSQL", 
                      "Docker", "Kafka", "HTML", "CSS", "JavaScript", "Git"
                    ],
                    projects: [
                      {
                        title: "Sistema ERP para Facturación Electrónica",
                        description: "Sistema integral de gestión empresarial desarrollado con arquitectura de microservicios"
                      },
                      {
                        title: "Sitio Web de Comandos Linux", 
                        description: "Plataforma educativa interactiva para aprender comandos básicos de Linux"
                      }
                    ]
                  };
                  
                  const cvContent = `
CURRÍCULUM VITAE
José Pablo Campos Rivera

INFORMACIÓN PERSONAL
Email: ${cvData.personalInfo.email}
Teléfono: ${cvData.personalInfo.phone}
Nacionalidad: ${cvData.personalInfo.nationality}

EDUCACIÓN
${cvData.education.map(edu => `${edu.degree}\n${edu.institution}\n${edu.period}`).join('\n\n')}

CERTIFICACIONES
${cvData.certifications.map(cert => `• ${cert}`).join('\n')}

HABILIDADES TÉCNICAS
${cvData.skills.join(', ')}

PROYECTOS DESTACADOS
${cvData.projects.map(proj => `${proj.title}\n${proj.description}`).join('\n\n')}

Desarrollador Backend con experiencia en sistemas ERP, microservicios y certificaciones AWS.
Especializado en Java Spring Boot, Python y arquitecturas cloud.
                  `.trim();
                  
                  const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'Jose_Pablo_Campos_CV.txt';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  
                  toast({
                    title: "CV Descargado",
                    description: "El archivo CV se ha descargado exitosamente.",
                  });
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar CV
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { User, Briefcase, Heart, Phone, Mail, MapPin, Globe } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="section-spacing bg-slate">
      <div className="container-spacing">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
          <User className="inline-block text-accent mr-4" />
          Acerca de Mí
        </h2>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
              alt="Professional developer portrait"
              className="rounded-xl shadow-lg w-full max-w-md mx-auto"
            />
          </div>
          <div className="space-y-6">
            <Card className="bg-card border-border card-hover">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-accent flex items-center">
                  <Briefcase className="mr-2" />
                  Perfil Profesional
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Soy un desarrollador de software especializado en BackEnd con Java (Spring Boot) y Python. 
                  Durante los últimos dos años, he estado desarrollando mi propio sistema ERP para facturación electrónica, 
                  integrando microservicios, bases de datos relacionales, mensajería asíncrona y servicios cloud con AWS.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  He participado en comunidades de software de código abierto y asisto activamente a eventos de tecnología 
                  como Firefox y Drupal Camp. Me apasiona construir soluciones escalables y limpias enfocadas en generar 
                  un impacto real en los procesos de negocio.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border card-hover">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-accent flex items-center">
                  <Heart className="mr-2" />
                  Información Personal
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Nacionalidad:</p>
                    <p className="font-semibold">Costa Rica</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Idiomas:</p>
                    <p className="font-semibold">Español (Nativo), Inglés (B2)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ID:</p>
                    <p className="font-semibold font-mono">1-1664-0506</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Teléfono:</p>
                    <p className="font-semibold">(506) 7039-1069</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
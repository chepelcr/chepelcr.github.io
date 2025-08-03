import { Card, CardContent } from "@/components/ui/card";
import { User, Briefcase, Heart, Phone, Mail, MapPin, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function AboutSection() {
  const { t } = useLanguage();
  return (
    <section id="about" className="section-spacing bg-slate">
      <div className="container-spacing">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
          <User className="inline-block text-accent mr-4" />
          {t("about.title")}
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
                  {t("about.professionalProfile")}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t("about.profileDesc1")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.profileDesc2")}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border card-hover">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-accent flex items-center">
                  <Heart className="mr-2" />
                  {t("about.personalInfo")}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">{t("about.nationality")}</p>
                    <p className="font-semibold">Costa Rica</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("about.languages")}</p>
                    <p className="font-semibold">Español (Nativo), Inglés (B2)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("about.id")}</p>
                    <p className="font-semibold font-mono">1-1664-0506</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("about.phone")}</p>
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
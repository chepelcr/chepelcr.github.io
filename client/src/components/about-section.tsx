import { Card, CardContent } from "@/components/ui/card";
import { User, Briefcase, Heart, Phone, Mail, MapPin, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { formatPhoneDisplay, formatPhoneHref } from "@/lib/phone";
import { getAbout } from "@/repositories/about.repository";
import { getPersonalInfo } from "@/repositories/personal-info.repository";
import { pickLang } from "@/lib/i18n-field";
import { parseRichText } from "@/lib/rich-text";

export default function AboutSection() {
  const { t, language } = useLanguage();
  const about = getAbout();
  const personalInfo = getPersonalInfo();
  const phone = personalInfo.phone;
  const [profilePara1, profilePara2, profilePara3] = about.profileParagraphs;
  return (
    <section id="about" className="section-spacing bg-slate">
      <div className="container-spacing">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
          <User className="inline-block text-accent mr-4" />
          {t("about.title")}
        </h2>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <Card className="bg-card border-border card-hover h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-accent flex items-center">
                  <Briefcase className="mr-2" />
                  {t("about.professionalProfile")}
                </h3>
                <div className="flex-grow">
                  <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
                    {parseRichText(pickLang(profilePara1, language))}
                  </p>
                    <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
                    {parseRichText(pickLang(profilePara3, language))}
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-justify">
                    {parseRichText(pickLang(profilePara2, language))}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="bg-card border-border card-hover h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-accent flex items-center">
                  <Heart className="mr-2" />
                  {t("about.personalInfo")}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 flex-grow">
                  <div>
                    <p className="text-muted-foreground">{pickLang(about.personalInfo.nationalityLabel, language)}</p>
                    <p className="font-semibold">{pickLang(personalInfo.nationality, language)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{pickLang(about.personalInfo.languagesLabel, language)}</p>
                    <p className="font-semibold">{pickLang(personalInfo.languages, language)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{pickLang(about.personalInfo.phoneLabel, language)}</p>
                    <a href={formatPhoneHref(phone)} className="font-semibold hover:text-accent transition-colors">{formatPhoneDisplay(phone)}</a>
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
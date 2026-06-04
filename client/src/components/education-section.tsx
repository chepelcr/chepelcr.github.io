import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {useLanguage} from "@/contexts/language-context";
import {GraduationCap, Award, BookOpen, ExternalLink} from "lucide-react";
import {getEducation} from "@/repositories/education.repository";
import {getCertifications} from "@/repositories/certifications.repository";
import {getGrouped} from "@/services/training.service";
import {pickLang} from "@/lib/i18n-field";

export default function EducationSection() {
    const {t, language} = useLanguage();
    const education = getEducation();
    const certifications = getCertifications();
    const training = getGrouped();

    return (
        <section id="education" className="section-spacing bg-navy">
            <div className="container-spacing">
                <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
                    <GraduationCap className="inline-block text-accent mr-4"/>
                    {t("education.title")}
                </h2>

                {/* Certifications Section */}
                <div className="mb-16">
                    <h3 className="text-2xl font-semibold mb-8 text-accent text-center flex items-center justify-center">
                        <Award className="mr-3"/>
                        {t("education.certificationsSubtitle")}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certifications.map((cert, index) => (
                            <Card key={index} className="bg-card border-border card-hover h-full">
                                <CardContent className="p-6 h-full flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <h4 className="text-lg font-semibold pr-2 leading-tight flex-grow">{cert.name}</h4>
                                        <Badge className="bg-accent text-accent-foreground flex-shrink-0 ml-2">
                                            {cert.badge}
                                        </Badge>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-muted-foreground font-mono text-sm">
                                            {t("education.activationDate")} {cert.date}
                                        </p>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-6 flex-grow leading-relaxed">{pickLang(cert.description, language)}</p>
                                    {cert.verifyUrl && (
                                        <div className="mt-auto">
                                            <a
                                                href={cert.verifyUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg text-accent hover:bg-accent hover:text-white text-sm font-medium transition-colors duration-200 w-full justify-center gap-2"
                                            >
                                                <ExternalLink className="h-4 w-4"/>
                                                {t("education.verifyCredential")}
                                            </a>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Education Section */}
                <div className="mb-16">
                    <h3 className="text-2xl font-semibold mb-8 text-accent text-center flex items-center justify-center">
                        <GraduationCap className="mr-3"/>
                        {t("education.educationSubtitle")}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {education.map((edu, index) => (
                            <Card key={index} className="bg-card border-border card-hover h-full">
                                <CardContent className="p-6 h-full flex flex-col">
                                    <div className="min-h-[3.5rem] mb-3">
                                        <h4 className="text-lg font-semibold leading-tight">{pickLang(edu.degree, language)}</h4>
                                    </div>
                                    <p className="text-accent font-medium mb-3 flex-grow">{pickLang(edu.institution, language)}</p>
                                    <p className="text-muted-foreground font-mono text-sm">{edu.period}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Training Section */}
                <div>
                    <h3 className="text-2xl font-semibold mb-8 text-accent text-center flex items-center justify-center">
                        <BookOpen className="mr-3"/>
                        {t("education.trainingSubtitle")}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {training.map((item, index) => (
                            <Card key={index} className="bg-card border-border card-hover">
                                <CardContent className="p-4">
                                    <h4 className="font-semibold mb-2">{pickLang(item.institution, language)}</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        {item.courses.map((course, courseIndex) => (
                                            <li key={courseIndex}>• {pickLang(course, language)}</li>
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
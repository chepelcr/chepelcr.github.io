import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {useLanguage} from "@/contexts/language-context";
import {Briefcase, Play} from "lucide-react";
import {getExperience} from "@/services/experience.service";
import {pickLang} from "@/lib/i18n-field";
import {parseRichText} from "@/lib/rich-text";
import {resolveIcon} from "@/lib/icons";

export default function ExperienceSection() {
    const {t, language} = useLanguage();
    const experiences = getExperience();

    return (
        <section id="experience" className="section-spacing bg-slate">
            <div className="container-spacing">
                <div className="relative mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-center">
                        <Briefcase className="inline-block text-accent mr-4"/>
                        {t("experience.title")}
                    </h2>

                    {/* Begin circle - aligned with title */}
                    <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2">
                        <div
                            className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                            <Play className="h-6 w-6"/>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <div
                        className="absolute left-8 w-0.5 bg-accent hidden md:block"
                        style={{
                            top: '-64px',
                            height: `calc(100% + 16px)`
                        }}
                    />

                    <div className="space-y-12">
                        {experiences.map((exp, index) => {
                            const Icon = resolveIcon(exp.iconName);
                            return (
                            <div key={index} className="relative">
                                <div className="flex items-start gap-8">
                                    <div className="hidden md:block flex-shrink-0 w-16">
                                        {/* Empty space for timeline circle positioning */}
                                    </div>
                                    <Card className="flex-1 bg-card border-border card-hover h-full relative">
                                        <CardContent className="p-6 h-full flex flex-col">
                                            {/* Company Name */}
                                            <p className="text-xl font-bold mb-4">{pickLang(exp.company, language)}</p>

                                            {/* Roles */}
                                            {exp.roles.map((role, roleIndex) => {
                                                const description = pickLang(role.description, language);
                                                return (
                                                <div key={roleIndex}>
                                                    {roleIndex > 0 && (
                                                        <hr className="border-border my-5"/>
                                                    )}
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                                        <h3 className="text-lg font-semibold text-accent">{pickLang(role.title, language)}</h3>
                                                        <span className="text-muted-foreground font-mono text-sm">{pickLang(role.period, language)}</span>
                                                    </div>
                                                    <div className="text-muted-foreground leading-relaxed mb-4">
                                                        {description.includes('\n') ? (
                                                            description.split('\n').map((paragraph: string, pIndex: number) => (
                                                                paragraph.trim() && (
                                                                    <p key={pIndex} className="text-justify mb-1">
                                                                        {parseRichText(paragraph.trim())}
                                                                    </p>
                                                                )
                                                            ))
                                                        ) : (
                                                            <p className="text-justify">{parseRichText(description)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                );
                                            })}

                                            {/* Skills */}
                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                {exp.skills.map((skill, skillIndex) => (
                                                    <Badge key={skillIndex}
                                                           className="bg-accent text-accent-foreground">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>

                                        {/* Timeline circle positioned at bottom of card */}
                                        <div className="hidden md:block absolute bottom-4" style={{left: '-96px'}}>
                                            <div
                                                className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                                                <Icon className="h-6 w-6"/>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

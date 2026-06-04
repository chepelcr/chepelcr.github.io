import { pickLang, type Lang } from "@/lib/i18n-field";
import { getPersonalInfo } from "@/repositories/personal-info.repository";
import { getAbout } from "@/repositories/about.repository";
import { getExperience } from "@/repositories/experience.repository";
import { getEducation } from "@/repositories/education.repository";
import { getCertifications } from "@/repositories/certifications.repository";
import { getTraining } from "@/repositories/training.repository";
import { getCvSkillLists, getPdfGroups } from "@/services/skills.service";
import { getForCv } from "@/services/projects.service";

export interface CVData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    languages: string;
  };
  about: string;
  experience: Array<{
    company: string;
    roles: Array<{
      title: string;
      period: string;
      description: string;
      hideFromPdf?: boolean;
    }>;
    skills: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
  }>;
  certifications: Array<{
    name: string;
    date: string;
  }>;
  additionalTraining: Array<{
    name: string;
    institution: string;
    date: string;
  }>;
  skills: {
    backend: string[];
    cloud: string[];
    databases: string[];
    tools: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

/**
 * Assembles the legacy CVData shape consumed by the app and the PDF generator,
 * reading from the content repositories/services and resolving bilingual fields
 * for the requested language.
 */
export function buildCvData(lang: Lang, t: (key: string) => string): CVData {
  const personal = getPersonalInfo();

  return {
    personalInfo: {
      name: personal.name,
      title: t("hero.title"),
      email: personal.email,
      phone: personal.phone,
      location: pickLang(personal.location, lang),
      languages: pickLang(personal.languages, lang),
    },
    about: pickLang(getAbout().description, lang),
    experience: getExperience().map((entry) => ({
      company: pickLang(entry.company, lang),
      roles: entry.roles.map((role) => ({
        title: pickLang(role.title, lang),
        period: pickLang(role.period, lang),
        description: pickLang(role.description, lang),
        hideFromPdf: role.hideFromPdf,
      })),
      skills: entry.skills,
    })),
    education: getEducation().map((edu) => ({
      degree: pickLang(edu.degree, lang),
      institution: pickLang(edu.institution, lang),
      period: edu.period,
    })),
    certifications: getCertifications().map((cert) => ({
      name: cert.name,
      date: cert.date,
    })),
    additionalTraining: getTraining().flatMap((group) =>
      group.courses.map((course) => ({
        name: pickLang(course, lang),
        institution: pickLang(group.institution, lang),
        date: "",
      }))
    ),
    skills: getCvSkillLists() as CVData["skills"],
    projects: getForCv().map((project) => ({
      name: pickLang(project.title, lang),
      description: pickLang(project.description, lang),
      technologies: project.technologies,
    })),
  };
}

/**
 * Returns the PDF skill groups with their labels resolved via the t() function.
 * Used by the PDF generator to render the technical-skills section.
 */
export function getCvSkillGroups(
  t: (key: string) => string
): Array<{ label: string; items: string[] }> {
  return getPdfGroups().map((group) => ({
    label: t(group.labelKey),
    items: group.items,
  }));
}

import { pickLang, type Lang } from "@/lib/i18n-field";
import { getPersonalInfo } from "@/repositories/personal-info.repository";
import { getExperience } from "@/repositories/experience.repository";
import { getEducation } from "@/repositories/education.repository";
import { getCertifications } from "@/repositories/certifications.repository";
import { getTraining } from "@/repositories/training.repository";
import { getSimpleCv } from "@/repositories/simple-cv.repository";

/**
 * The simplified, non-technical CV. Deliberately narrower than CVData: no technical
 * skill matrix, no per-company tech stacks and no projects section.
 */
export interface SimpleCVData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    languages: string;
  };
  summary: string;
  toolsLine: string;
  softSkills: string[];
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
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
  }>;
}

/**
 * Assembles the simplified CV for the requested language, reading the plain-language
 * copy from simple-cv.json and everything else (companies, dates, studies,
 * certifications, training) from the shared content repositories.
 *
 * Each entry in `positions` resolves against experience.json: the company always comes
 * from the source entry, while title and period come from the referenced role unless the
 * position overrides them — which is how several roles at one company are presented as a
 * single merged position. `hideFromPdf` is intentionally ignored here: it belongs to the
 * technical CV, and a role hidden there may well be the most relevant one here.
 */
export function buildSimpleCvData(lang: Lang): SimpleCVData {
  const personal = getPersonalInfo();
  const simple = getSimpleCv();
  const experience = getExperience();

  const positions = simple.positions.map((position) => {
    const entry = experience.find((e) => e.id === position.experienceId);
    if (!entry) {
      throw new Error(
        `simple-cv.json: unknown experienceId "${position.experienceId}". ` +
          `Known ids: ${experience.map((e) => e.id).join(", ")}`
      );
    }
    const role = entry.roles[position.roleIndex];
    if (!role) {
      throw new Error(
        `simple-cv.json: experienceId "${position.experienceId}" has no role at index ` +
          `${position.roleIndex} (it has ${entry.roles.length}).`
      );
    }
    return {
      title: pickLang(position.title ?? role.title, lang),
      company: pickLang(entry.company, lang),
      period: pickLang(position.period ?? role.period, lang),
      description: pickLang(position.description, lang),
    };
  });

  const { educationIds, certificationIds } = simple;

  return {
    personalInfo: {
      name: personal.name,
      title: pickLang(simple.title, lang),
      email: personal.email,
      phone: personal.phone,
      location: pickLang(personal.location, lang),
      languages: pickLang(personal.languages, lang),
    },
    summary: pickLang(simple.summary, lang),
    toolsLine: pickLang(simple.toolsLine, lang),
    softSkills: simple.softSkills.map((skill) => pickLang(skill, lang)),
    experience: positions,
    education: getEducation()
      .filter((edu) => educationIds.length === 0 || educationIds.includes(edu.id))
      .map((edu) => ({
        degree: pickLang(edu.degree, lang),
        institution: pickLang(edu.institution, lang),
        period: edu.period,
      })),
    certifications: getCertifications()
      .filter((cert) => certificationIds.length === 0 || certificationIds.includes(cert.id))
      .map((cert) => ({ name: cert.name, date: cert.date })),
    additionalTraining: simple.includeTraining
      ? getTraining().flatMap((group) =>
          group.courses.map((course) => ({
            name: pickLang(course, lang),
            institution: pickLang(group.institution, lang),
          }))
        )
      : [],
  };
}

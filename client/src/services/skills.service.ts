import {
  getSkills,
  type SkillCategory,
  type SoftSkill,
  type PdfSkillGroup,
} from "@/repositories/skills.repository";

export function getCategories(): SkillCategory[] {
  return getSkills().categories;
}

export function getSoft(): SoftSkill[] {
  return getSkills().soft;
}

/**
 * Derives the legacy cvData.skills shape ({ backend, cloud, databases, tools }
 * → string[] of item names) from the skill categories.
 */
export function getCvSkillLists(): Record<string, string[]> {
  return getCategories().reduce<Record<string, string[]>>((acc, category) => {
    acc[category.key] = category.items.map((item) => item.name);
    return acc;
  }, {});
}

export function getPdfGroups(): PdfSkillGroup[] {
  return getSkills().pdf.groups;
}

import data from "@/content/skills.json";

export type Skills = typeof data;
export type SkillCategory = Skills["categories"][number];
export type SkillItem = SkillCategory["items"][number];
export type SoftSkill = Skills["soft"][number];
export type PdfSkillGroup = Skills["pdf"]["groups"][number];

export function getSkills(): Skills {
  return data;
}

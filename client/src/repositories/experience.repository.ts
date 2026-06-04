import data from "@/content/experience.json";

export type ExperienceList = typeof data;
export type Experience = ExperienceList[number];
export type ExperienceRole = Experience["roles"][number];

export function getExperience(): ExperienceList {
  return data;
}

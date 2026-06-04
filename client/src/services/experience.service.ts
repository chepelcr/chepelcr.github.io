import {
  getExperience as getExperienceData,
  type Experience,
  type ExperienceList,
} from "@/repositories/experience.repository";

export function getExperience(): ExperienceList {
  return getExperienceData();
}

export function getCurrent(): Experience[] {
  return getExperienceData().filter((entry) => entry.current);
}

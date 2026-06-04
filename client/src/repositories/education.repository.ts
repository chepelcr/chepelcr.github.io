import data from "@/content/education.json";

export type Education = (typeof data)[number];

export function getEducation(): Education[] {
  return data;
}

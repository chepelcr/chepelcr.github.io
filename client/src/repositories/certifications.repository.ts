import data from "@/content/certifications.json";

export type Certification = (typeof data)[number];

export function getCertifications(): Certification[] {
  return data;
}

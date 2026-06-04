import data from "@/content/personal-info.json";

export type PersonalInfo = typeof data;

export function getPersonalInfo() {
  return data;
}

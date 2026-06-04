import data from "@/content/about.json";

export type About = typeof data;

export function getAbout(): About {
  return data;
}

import data from "@/content/hero.json";

export type Hero = typeof data;

export function getHero(): Hero {
  return data;
}

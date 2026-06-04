import data from "@/content/navigation.json";

export type Navigation = typeof data;

export function getNavigation(): Navigation {
  return data;
}

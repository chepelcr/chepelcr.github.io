import data from "@/content/themes.json";

export type Theme = (typeof data)[number];

export function getThemes(): Theme[] {
  return data;
}

export function getActiveTheme(): Theme {
  return data.find((theme) => theme.isActive) ?? data[0];
}

import data from "@/content/branding.json";

export type Branding = typeof data;

export function getBranding(): Branding {
  return data;
}

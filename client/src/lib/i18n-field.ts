export type Lang = "es" | "en";

export type BiField = { es?: string; en?: string } | undefined;

export function pickLang(field: BiField, lang: Lang): string {
  return field?.[lang] ?? field?.es ?? "";
}

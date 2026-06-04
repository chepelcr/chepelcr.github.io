import data from "@/content/footer.json";

export type Footer = typeof data;

export function getFooter() {
  return data;
}

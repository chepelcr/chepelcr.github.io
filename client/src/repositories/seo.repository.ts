import data from "@/content/seo.json";

export type Seo = typeof data;

export function getSeo() {
  return data;
}

import type { Language } from "@/contexts/language-context";

export type AdminGroup = "content" | "cms" | "platform";

/** Bilingual admin label. The admin chrome is bilingual: it follows the in-panel
 *  language toggle (default Spanish). */
export interface BiLabel {
  es: string;
  en: string;
}

export interface ContentPage {
  file: string;
  label: BiLabel;
  route: string;
  icon: string;
  group: AdminGroup;
}

/** Dashboard is its own top-level entry (rendered above the groups, not inside Platform). */
export const DASHBOARD_PAGE: ContentPage = {
  file: "__dashboard",
  label: { es: "Panel", en: "Dashboard" },
  route: "/admin/dashboard",
  icon: "home",
  group: "content",
};

export const CONTENT_PAGES: ContentPage[] = [
  // Content entities
  { file: "personal-info.json", label: { es: "Información Personal", en: "Personal Info" }, route: "/admin/personal-info", icon: "user", group: "content" },
  { file: "hero.json", label: { es: "Portada", en: "Hero" }, route: "/admin/hero", icon: "star", group: "content" },
  { file: "about.json", label: { es: "Acerca de", en: "About" }, route: "/admin/about", icon: "info", group: "content" },
  { file: "skills.json", label: { es: "Habilidades", en: "Skills" }, route: "/admin/skills", icon: "code", group: "content" },
  { file: "experience.json", label: { es: "Experiencia", en: "Experience" }, route: "/admin/experience", icon: "briefcase", group: "content" },
  { file: "education.json", label: { es: "Educación", en: "Education" }, route: "/admin/education", icon: "graduation", group: "content" },
  { file: "certifications.json", label: { es: "Certificaciones", en: "Certifications" }, route: "/admin/certifications", icon: "award", group: "content" },
  { file: "training.json", label: { es: "Capacitaciones", en: "Training" }, route: "/admin/training", icon: "book", group: "content" },
  { file: "projects.json", label: { es: "Proyectos", en: "Projects" }, route: "/admin/projects", icon: "laptop", group: "content" },
  { file: "contact.json", label: { es: "Contacto", en: "Contact" }, route: "/admin/contact", icon: "mail", group: "content" },
  { file: "navigation.json", label: { es: "Navegación", en: "Navigation" }, route: "/admin/navigation", icon: "menu", group: "content" },
  { file: "footer.json", label: { es: "Pie de Página", en: "Footer" }, route: "/admin/footer", icon: "panelBottom", group: "content" },
  { file: "seo.json", label: { es: "SEO", en: "SEO" }, route: "/admin/seo", icon: "search", group: "content" },

  // CMS tooling
  { file: "branding.json", label: { es: "Identidad del Sitio", en: "Site Identity" }, route: "/admin/identity", icon: "palette", group: "cms" },
  { file: "media.json", label: { es: "Medios", en: "Media" }, route: "/admin/media", icon: "image", group: "cms" },
  { file: "__translations", label: { es: "Traducciones", en: "Translations" }, route: "/admin/translations", icon: "languages", group: "cms" },
  { file: "__versions", label: { es: "Versiones de Contenido", en: "Content Versions" }, route: "/admin/content-versions", icon: "download2", group: "cms" },

  // Platform tooling
  { file: "inventory.json", label: { es: "Inventario", en: "Inventory" }, route: "/admin/inventory", icon: "network", group: "platform" },
  { file: "__diagnostics", label: { es: "Diagnósticos", en: "Diagnostics" }, route: "/admin/diagnostics", icon: "activity", group: "platform" },
  { file: "__explorer", label: { es: "Explorador de Contenido", en: "Content Explorer" }, route: "/admin/content-explorer", icon: "folderTree", group: "platform" },
];

/** Bilingual headings for each sidebar group. */
export const GROUP_LABELS: Record<AdminGroup, BiLabel> = {
  content: { es: "Contenido", en: "Content" },
  cms: { es: "CMS", en: "CMS" },
  platform: { es: "Plataforma", en: "Platform" },
};

/** Icon shown next to each group heading. */
export const GROUP_ICONS: Record<AdminGroup, string> = {
  content: "book",
  cms: "palette",
  platform: "server",
};

export const GROUP_ORDER: AdminGroup[] = ["content", "cms", "platform"];

/** Every routable admin page (dashboard + the grouped pages) — used by the router. */
export const ALL_PAGES: ContentPage[] = [DASHBOARD_PAGE, ...CONTENT_PAGES];

/** Returns only the manifest rows backed by a real content JSON file (skips synthetic "__*" pages). */
export function getContentFiles(): string[] {
  return CONTENT_PAGES.filter((page) => !page.file.startsWith("__")).map((page) => page.file);
}

/** Looks up a page's label by its content filename for the given language. */
export function labelForFile(file: string, lang: Language): string {
  const page = ALL_PAGES.find((p) => p.file === file);
  return page ? page.label[lang] : file;
}

import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import { useAdminStore } from "@/lib/admin-store";
import { CONTENT_PAGES } from "@/admin/manifest";
import { PageHeader } from "@/components/admin/PageHeader";
import { resolveIcon } from "@/lib/icons";

interface StatCard {
  label: { es: string; en: string };
  count: number;
  icon: string;
  route: string;
}

const T = {
  es: { title: "Panel", overview: "Resumen de Contenido" },
  en: { title: "Dashboard", overview: "Content Overview" },
};

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();

  const projects = useAdminStore((state) => state.projects);
  const experience = useAdminStore((state) => state.experience);
  const certifications = useAdminStore((state) => state.certifications);
  const skills = useAdminStore((state) => state.skills);
  const media = useAdminStore((state) => state.media);

  const stats: StatCard[] = [
    { label: { es: "Proyectos", en: "Projects" }, count: projects.length, icon: "laptop", route: "/admin/projects" },
    { label: { es: "Empresas (experiencia)", en: "Companies (experience)" }, count: experience.length, icon: "briefcase", route: "/admin/experience" },
    { label: { es: "Certificaciones", en: "Certifications" }, count: certifications.length, icon: "award", route: "/admin/certifications" },
    { label: { es: "Categorías de habilidades", en: "Skill categories" }, count: skills.categories.length, icon: "code", route: "/admin/skills" },
    { label: { es: "Elementos multimedia", en: "Media items" }, count: media.items.length, icon: "image", route: "/admin/media" },
  ];

  // Real content entities (skip synthetic "__*" tooling pages) for the overview list.
  const overview = CONTENT_PAGES.filter((page) => !page.file.startsWith("__"));

  return (
    <div className="space-y-8">
      <PageHeader title={T[language].title} />

      {/* ---------- Stat cards ---------- */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = resolveIcon(stat.icon);
          return (
            <button
              key={stat.label.en}
              type="button"
              onClick={() => navigate(stat.route)}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-accent"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-accent" />
                <span className="text-2xl font-bold text-foreground">{stat.count}</span>
              </div>
              <span className="text-sm text-muted-foreground">{stat.label[language]}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- Content overview ---------- */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">{T[language].overview}</h2>
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {overview.map((page) => {
            const Icon = resolveIcon(page.icon);
            return (
              <button
                key={page.file}
                type="button"
                onClick={() => navigate(page.route)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-background"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate text-sm font-medium text-foreground">{page.label[language]}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{page.file}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

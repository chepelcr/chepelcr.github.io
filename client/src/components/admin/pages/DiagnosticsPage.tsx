import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useAdminStore } from "@/lib/admin-store";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/components/theme-provider";
import { fetchGitLog, LOCAL_CMS_ENABLED } from "@/lib/local-cms";
import { resolveIcon } from "@/lib/icons";

const CheckIcon = resolveIcon("shield");
const ActivityIcon = resolveIcon("activity");
const GitBranchIcon = resolveIcon("gitBranch");

const COMMITS_PER_PAGE = 5;

interface HealthCheck {
  label: string;
  ok: boolean;
}

interface Commit {
  hash?: string;
  message?: string;
  author?: string;
  date?: string;
}

/** Best-effort extraction of a commit list from the (loosely typed) git-log response. */
function parseCommits(raw: unknown): { commits: Commit[]; ok: boolean } {
  if (!raw || typeof raw !== "object") return { commits: [], ok: false };
  const obj = raw as Record<string, unknown>;
  if (obj.ok === false) return { commits: [], ok: false };

  const list =
    (Array.isArray(obj.commits) && obj.commits) ||
    (Array.isArray(obj.log) && obj.log) ||
    (Array.isArray(raw) && (raw as unknown[])) ||
    [];

  const commits = (list as unknown[]).map((entry) => {
    const e = (entry ?? {}) as Record<string, unknown>;
    return {
      hash: typeof e.hash === "string" ? e.hash : typeof e.sha === "string" ? e.sha : undefined,
      message:
        typeof e.message === "string"
          ? e.message
          : typeof e.subject === "string"
          ? e.subject
          : undefined,
      author:
        typeof e.author === "string"
          ? e.author
          : typeof e.authorName === "string"
          ? e.authorName
          : undefined,
      date: typeof e.date === "string" ? e.date : undefined,
    } satisfies Commit;
  });

  return { commits, ok: true };
}

function StatusPill({ ok, okLabel, missingLabel }: { ok: boolean; okLabel: string; missingLabel: string }) {
  return (
    <span
      className={
        ok
          ? "inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent"
          : "inline-flex items-center rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-medium text-destructive"
      }
    >
      {ok ? okLabel : missingLabel}
    </span>
  );
}

export default function DiagnosticsPage() {
  const hero = useAdminStore((state) => state.hero);
  const projects = useAdminStore((state) => state.projects);
  const seo = useAdminStore((state) => state.seo);

  const { language } = useLanguage();
  const { theme } = useTheme();

  const T = {
    es: {
      title: "Diagnóstico",
      intro: "Estado del sitio, salud del contenido y actividad reciente.",
      ok: "Correcto",
      missing: "Falta",
      contentHealth: "Salud del contenido",
      heroHasTitle: "Hero tiene un título",
      projectsLoaded: "Proyectos cargados",
      seoConfigured: "SEO configurado",
      systemInfo: "Información del sistema",
      mode: "Modo",
      development: "desarrollo",
      production: "producción",
      localCms: "CMS local",
      enabled: "habilitado",
      disabled: "deshabilitado",
      activeLanguage: "Idioma activo",
      activeTheme: "Tema activo",
      recentCommits: "Commits recientes",
      newer: "Más recientes",
      older: "Más antiguos",
      page: "Página",
      loading: "Cargando commits…",
      unavailable: "Registro de Git no disponible (solo accesible en modo desarrollo).",
      noCommits: "No se encontraron commits.",
      noMessage: "(sin mensaje)",
    },
    en: {
      title: "Diagnostics",
      intro: "Site status, content health, and recent activity.",
      ok: "OK",
      missing: "Missing",
      contentHealth: "Content health",
      heroHasTitle: "Hero has a title",
      projectsLoaded: "Projects loaded",
      seoConfigured: "SEO configured",
      systemInfo: "System info",
      mode: "Mode",
      development: "development",
      production: "production",
      localCms: "Local CMS",
      enabled: "enabled",
      disabled: "disabled",
      activeLanguage: "Active language",
      activeTheme: "Active theme",
      recentCommits: "Recent commits",
      newer: "Newer",
      older: "Older",
      page: "Page",
      loading: "Loading commits…",
      unavailable: "Git log unavailable (only accessible while running in dev).",
      noCommits: "No commits found.",
      noMessage: "(no message)",
    },
  }[language];

  const isDev = import.meta.env.DEV;

  // Content health checks derived from the live store slices.
  const healthChecks: HealthCheck[] = [
    {
      label: T.heroHasTitle,
      ok: Boolean(hero?.title?.es?.trim() && hero?.title?.en?.trim()),
    },
    {
      label: T.projectsLoaded,
      ok: Array.isArray(projects) && projects.length > 0,
    },
    {
      label: T.seoConfigured,
      ok: Boolean(
        seo?.siteUrl?.trim() &&
          seo?.defaultTitle?.es?.trim() &&
          seo?.defaultDescription?.es?.trim(),
      ),
    },
  ];

  // Recent commits panel — degrades gracefully when not running in dev.
  const [page, setPage] = useState(0);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [logState, setLogState] = useState<"loading" | "ready" | "unavailable">(
    LOCAL_CMS_ENABLED ? "loading" : "unavailable",
  );

  useEffect(() => {
    if (!LOCAL_CMS_ENABLED) {
      setLogState("unavailable");
      return;
    }
    let cancelled = false;
    setLogState("loading");
    void fetchGitLog(page * COMMITS_PER_PAGE, COMMITS_PER_PAGE).then((raw) => {
      if (cancelled) return;
      const { commits: parsed, ok } = parseCommits(raw);
      if (!ok) {
        setLogState("unavailable");
        return;
      }
      setCommits(parsed);
      setLogState("ready");
    });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const atFirstPage = page === 0;
  const atLastPage = commits.length < COMMITS_PER_PAGE;

  return (
    <div className="space-y-6">
      <PageHeader title={T.title} />

      <p className="text-sm text-muted-foreground">
        {T.intro}
      </p>

      {/* Content health */}
      <section className="bg-card border border-border rounded-lg p-4 space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CheckIcon className="h-4 w-4 text-accent" />
          {T.contentHealth}
        </h2>
        <div className="divide-y divide-border">
          {healthChecks.map((check) => (
            <div
              key={check.label}
              className="flex items-center justify-between gap-4 py-2.5"
            >
              <span className="text-sm text-foreground">{check.label}</span>
              <StatusPill ok={check.ok} okLabel={T.ok} missingLabel={T.missing} />
            </div>
          ))}
        </div>
      </section>

      {/* System info */}
      <section className="bg-card border border-border rounded-lg p-4 space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ActivityIcon className="h-4 w-4 text-accent" />
          {T.systemInfo}
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{T.mode}</dt>
            <dd className="font-medium text-foreground">
              {isDev ? T.development : T.production}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{T.localCms}</dt>
            <dd className="font-medium text-foreground">
              {LOCAL_CMS_ENABLED ? T.enabled : T.disabled}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{T.activeLanguage}</dt>
            <dd className="font-medium text-foreground uppercase">{language}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{T.activeTheme}</dt>
            <dd className="font-medium text-foreground">{theme}</dd>
          </div>
        </dl>
      </section>

      {/* Recent commits */}
      <section className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <GitBranchIcon className="h-4 w-4 text-accent" />
            {T.recentCommits}
          </h2>
          {logState === "ready" ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={atFirstPage}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {T.newer}
              </button>
              <span className="text-xs text-muted-foreground">{T.page} {page + 1}</span>
              <button
                type="button"
                disabled={atLastPage}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {T.older}
              </button>
            </div>
          ) : null}
        </div>

        {logState === "loading" ? (
          <p className="text-sm text-muted-foreground">{T.loading}</p>
        ) : logState === "unavailable" ? (
          <p className="text-sm text-muted-foreground">
            {T.unavailable}
          </p>
        ) : commits.length === 0 ? (
          <p className="text-sm text-muted-foreground">{T.noCommits}</p>
        ) : (
          <ul className="divide-y divide-border">
            {commits.map((commit, index) => (
              <li
                key={commit.hash ?? `${page}-${index}`}
                className="flex flex-col gap-1 py-2.5"
              >
                <span className="text-sm font-medium text-foreground">
                  {commit.message ?? T.noMessage}
                </span>
                <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {commit.hash ? (
                    <code className="rounded bg-background px-1.5 py-0.5 font-mono">
                      {commit.hash.slice(0, 7)}
                    </code>
                  ) : null}
                  {commit.author ? <span>{commit.author}</span> : null}
                  {commit.date ? <span>{commit.date}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

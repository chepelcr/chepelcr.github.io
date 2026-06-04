import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, ExternalLink, Info, Loader2, Menu, Moon, Sun, UploadCloud } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Hint } from "@/components/admin/Hint";
import { useLanguage } from "@/contexts/language-context";
import { useAdminUi, guardNavigation } from "@/lib/admin-ui";
import { publishChanges } from "@/lib/local-cms";

type PublishState = "idle" | "publishing" | "ok" | "nothing" | "error";

interface Props {
  /** Opens the mobile sidebar drawer (only shown below lg). */
  onMenu: () => void;
}

export function AdminTopbar({ onMenu }: Props) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const pendingPublish = useAdminUi((s) => s.pendingPublish);
  const refreshPublish = useAdminUi((s) => s.refreshPublish);
  const [state, setState] = useState<PublishState>("idle");

  const isDark =
    theme === "dark" ||
    (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Keep the pending-publish flag in sync with the git working tree.
  useEffect(() => {
    refreshPublish();
    const onChange = () => refreshPublish();
    window.addEventListener("focus", onChange);
    window.addEventListener("dxp:content-saved", onChange);
    return () => {
      window.removeEventListener("focus", onChange);
      window.removeEventListener("dxp:content-saved", onChange);
    };
  }, [refreshPublish]);

  const handlePublish = useCallback(async () => {
    if (state === "publishing") return;
    setState("publishing");
    const result = await publishChanges();
    if (result.nothingToPublish) setState("nothing");
    else if (result.ok) setState("ok");
    else setState("error");
    await refreshPublish();
    window.setTimeout(() => setState("idle"), 2500);
  }, [state, refreshPublish]);

  const handleViewSite = (e: React.MouseEvent) => {
    if (guardNavigation("/")) e.preventDefault();
  };

  const disabled = state === "publishing" || (!pendingPublish && state === "idle");

  const publishStyles: Record<PublishState, string> = {
    idle: pendingPublish
      ? "bg-accent text-[#0f172a] hover:opacity-90"
      : "bg-muted text-muted-foreground cursor-not-allowed",
    publishing: "bg-accent/80 text-[#0f172a] cursor-wait",
    ok: "bg-emerald-600 text-white",
    nothing: "bg-muted text-muted-foreground",
    error: "bg-destructive text-destructive-foreground",
  };

  const L = {
    es: { admin: "Panel de Administración", viewSite: "Ver sitio", themeLight: "Tema claro", themeDark: "Tema oscuro", publish: "Publicar", publishing: "Publicando…", published: "Publicado", nothing: "Nada que publicar", error: "Error al publicar" },
    en: { admin: "Admin Panel", viewSite: "View site", themeLight: "Light theme", themeDark: "Dark theme", publish: "Publish", publishing: "Publishing…", published: "Published", nothing: "Nothing to publish", error: "Publish error" },
  }[language];

  const publishContent = () => {
    switch (state) {
      case "publishing":
        return (<><Loader2 className="h-4 w-4 animate-spin" />{L.publishing}</>);
      case "ok":
        return (<><Check className="h-4 w-4" />{L.published}</>);
      case "nothing":
        return (<><Info className="h-4 w-4" />{L.nothing}</>);
      case "error":
        return (<><AlertCircle className="h-4 w-4" />{L.error}</>);
      default:
        return (<><UploadCloud className="h-4 w-4" />{L.publish}</>);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-4" data-testid="admin-topbar">
      {/* Mobile drawer toggle */}
      <button
        onClick={onMenu}
        className="text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        aria-label="Menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      <span className="text-sm font-semibold text-foreground">{L.admin}</span>

      <div className="flex-1" />

      {/* Language toggle (switches the working/preview language without leaving /admin) */}
      <div className="flex items-center rounded-lg border border-border p-0.5" role="group" aria-label="Idioma">
        {(["es", "en"] as const).map((lng) => (
          <button
            key={lng}
            onClick={() => setLanguage(lng)}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
              language === lng ? "bg-accent text-[#0f172a]" : "text-muted-foreground hover:text-foreground"
            }`}
            title={lng === "es" ? "Español" : "English"}
          >
            {lng}
          </button>
        ))}
      </div>

      {/* Theme toggle */}
      <Hint label={isDark ? L.themeLight : L.themeDark} side="bottom">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        >
          <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
        </button>
      </Hint>

      {/* View public site */}
      <Hint label={L.viewSite} side="bottom">
        <a
          href="/"
          onClick={handleViewSite}
          className="hidden h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="hidden md:inline">{L.viewSite}</span>
        </a>
      </Hint>

      {/* Publish */}
      <Hint label={state === "idle" && !pendingPublish ? L.nothing : L.publish} side="bottom">
        <button
          onClick={handlePublish}
          disabled={disabled}
          className={`flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors disabled:opacity-90 ${publishStyles[state]}`}
        >
          {publishContent()}
        </button>
      </Hint>
    </header>
  );
}

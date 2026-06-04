import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { guardNavigation } from "@/lib/admin-ui";
import { resolveIcon } from "@/lib/icons";
import { Hint } from "@/components/admin/Hint";
import {
  CONTENT_PAGES,
  DASHBOARD_PAGE,
  GROUP_LABELS,
  GROUP_ICONS,
  GROUP_ORDER,
  type AdminGroup,
} from "@/admin/manifest";
import { getBranding } from "@/repositories/branding.repository";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
}

type OpenGroup = AdminGroup | "";

/** Dark text that stays readable on the lime accent in BOTH light and dark mode. */
const ON_ACCENT = "text-[#0f172a]";

function activeGroup(location: string): OpenGroup {
  for (const group of GROUP_ORDER) {
    if (CONTENT_PAGES.some((p) => p.group === group && (location === p.route || location.startsWith(p.route + "/")))) {
      return group;
    }
  }
  // No content group matches (e.g. on the dashboard) → start with everything collapsed.
  return "";
}

export function AdminSidebar({ collapsed, onToggle, onClose }: Props) {
  const { language } = useLanguage();
  const [location, navigate] = useLocation();
  const [openGroup, setOpenGroup] = useState<OpenGroup>(() => activeGroup(location));
  const branding = getBranding();

  // Nav is button-based (not <Link>) so the Radix tooltip's asChild trigger
  // reliably receives hover/focus props (Wouter's <Link> doesn't forward them).
  const go = (href: string) => {
    if (guardNavigation(href)) return; // opens the unsaved-changes modal when dirty
    navigate(href);
    onClose?.();
  };

  const toggleGroup = (group: AdminGroup) => setOpenGroup((prev) => (prev === group ? "" : group));

  const isActive = (route: string) => location === route || location.startsWith(route + "/");

  return (
    <aside
      className={`relative flex h-full flex-col border-r border-border bg-card transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      data-testid="admin-sidebar"
    >
      {/* Edge collapse/expand tab (desktop) */}
      <Hint
        label={collapsed ? (language === "en" ? "Expand" : "Expandir") : language === "en" ? "Collapse" : "Colapsar"}
        side="right"
      >
        <button
          onClick={onToggle}
          className="absolute -right-3 top-16 z-20 hidden h-6 w-6 items-center justify-center rounded-full bg-accent text-[#0f172a] shadow-md ring-2 ring-background transition-opacity hover:opacity-90 lg:flex"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </Hint>

      {/* Brand row */}
      <div className={`flex h-14 items-center border-b border-border px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-[#0f172a]">
            {branding.companyName.charAt(0)}
          </span>
          {!collapsed && <span className="truncate text-sm font-semibold text-foreground">Admin</span>}
        </div>
        {onClose && !collapsed && (
          <button
            onClick={onClose}
            className="rounded p-1 text-foreground/40 transition-colors hover:text-foreground lg:hidden"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {/* Dashboard — standalone top link, not part of any group */}
        {(() => {
          const Icon = resolveIcon(DASHBOARD_PAGE.icon);
          const active = isActive(DASHBOARD_PAGE.route);
          return (
            <Hint label={DASHBOARD_PAGE.label[language]} side="right">
              <button
                type="button"
                onClick={() => {
                  if (guardNavigation(DASHBOARD_PAGE.route)) return;
                  setOpenGroup(""); // Panel belongs to no group → collapse them all
                  navigate(DASHBOARD_PAGE.route);
                  onClose?.();
                }}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  active ? `bg-accent ${ON_ACCENT}` : "text-foreground/80 hover:bg-slate hover:text-foreground"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className={`shrink-0 ${collapsed ? "h-5 w-5" : "h-4 w-4"}`} />
                {!collapsed && <span className="truncate">{DASHBOARD_PAGE.label[language]}</span>}
              </button>
            </Hint>
          );
        })()}

        {GROUP_ORDER.map((group) => {
          const pages = CONTENT_PAGES.filter((p) => p.group === group);
          if (pages.length === 0) return null;
          const isOpen = collapsed || openGroup === group;
          const GroupIcon = resolveIcon(GROUP_ICONS[group]);

          return (
            <div key={group}>
              {!collapsed && (
                <Hint label={GROUP_LABELS[group][language]} side="right">
                  <button
                    onClick={() => toggleGroup(group)}
                    className={`group mb-0.5 flex w-full items-center justify-between rounded-lg px-3 py-1.5 transition-colors ${
                      isOpen ? `bg-accent ${ON_ACCENT}` : "text-foreground/40 hover:text-foreground/60"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <GroupIcon className="h-4 w-4 shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{GROUP_LABELS[group][language]}</span>
                    </span>
                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`} />
                  </button>
                </Hint>
              )}

              <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="space-y-0.5">
                    {pages.map((page) => {
                      const Icon = resolveIcon(page.icon);
                      const active = isActive(page.route);
                      return (
                        <Hint key={page.route} label={page.label[language]} side="right">
                          <button
                            type="button"
                            onClick={() => go(page.route)}
                            className={`flex w-full items-center gap-3 rounded-lg py-2 text-sm transition-all ${
                              collapsed ? "px-3 justify-center" : "pl-6 pr-3"
                            } ${
                              active
                                ? `bg-accent ${ON_ACCENT} font-medium`
                                : "text-foreground/70 hover:bg-slate hover:text-foreground"
                            }`}
                          >
                            <Icon className={`shrink-0 ${collapsed ? "h-5 w-5" : "h-4 w-4"}`} />
                            {!collapsed && <span className="truncate">{page.label[language]}</span>}
                          </button>
                        </Hint>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer — back to public site */}
      <div className={`border-t border-border p-3 ${collapsed ? "text-center" : ""}`}>
        <Hint label={language === "en" ? "Back to site" : "Volver al sitio"} side="right">
          <button
            type="button"
            onClick={() => go("/")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-xs text-foreground/50 transition-colors hover:bg-slate hover:text-foreground/80"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{language === "en" ? "Back to site" : "Volver al sitio"}</span>}
          </button>
        </Hint>
      </div>
    </aside>
  );
}

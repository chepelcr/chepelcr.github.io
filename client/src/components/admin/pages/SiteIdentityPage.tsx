import { useEffect, useState } from "react";
import { useAdminStore, useEntityDirty, downloadJson } from "@/lib/admin-store";
import { useAdminUi } from "@/lib/admin-ui";
import {
  BilingualSection,
  BilingualField,
  TextField,
  ColorField,
} from "@/components/admin/AdminUI";
import { FloatingSaveButton } from "@/components/admin/FloatingSaveButton";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useLanguage } from "@/contexts/language-context";
import brandingData from "@/content/branding.json";
import themesData from "@/content/themes.json";

type Branding = typeof brandingData;
type Themes = typeof themesData;
type Theme = Themes[number];

const COLOR_KEYS: Array<{ key: keyof Theme["colors"]; label: { es: string; en: string } }> = [
  { key: "accent", label: { es: "Acento", en: "Accent" } },
  { key: "primary", label: { es: "Primario", en: "Primary" } },
  { key: "background", label: { es: "Fondo", en: "Background" } },
  { key: "navyLight", label: { es: "Azul marino (claro)", en: "Navy (light)" } },
  { key: "slateLight", label: { es: "Pizarra (claro)", en: "Slate (light)" } },
  { key: "navyDark", label: { es: "Azul marino (oscuro)", en: "Navy (dark)" } },
  { key: "slateDark", label: { es: "Pizarra (oscuro)", en: "Slate (dark)" } },
];

const slug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyTheme = (name: string): Theme => ({
  id: slug(name) || `theme-${Date.now()}`,
  name,
  isActive: false,
  colors: {
    accent: "#a3e635",
    primary: "#a3e635",
    background: "#ffffff",
    navyLight: "#f1f5f9",
    slateLight: "#ffffff",
    navyDark: "#1c2333",
    slateDark: "#2c3444",
  },
});

export default function SiteIdentityPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      title: "Identidad del sitio",
      addTheme: "+ Añadir tema",
      branding: "Marca",
      companyName: "Nombre de la empresa",
      shortName: "Nombre corto",
      tagline: "Eslogan",
      logoUrl: "URL del logotipo",
      logoUrlDark: "URL del logotipo (oscuro)",
      faviconUrl: "URL del favicon",
      themes: "Temas",
      themeName: "Nombre del tema",
      active: "Activo",
      activate: "Activar",
      duplicate: "Duplicar",
      delete: "Eliminar",
      atLeastOne: "Se requiere al menos un tema.",
      confirmDelete: "¿Eliminar este tema?",
      newThemePrompt: "Nombre del nuevo tema",
      newThemeDefault: "Nuevo tema",
      copySuffix: "(copia)",
    },
    en: {
      title: "Site Identity",
      addTheme: "+ Add theme",
      branding: "Branding",
      companyName: "Company Name",
      shortName: "Short Name",
      tagline: "Tagline",
      logoUrl: "Logo URL",
      logoUrlDark: "Logo URL (dark)",
      faviconUrl: "Favicon URL",
      themes: "Themes",
      themeName: "Theme name",
      active: "Active",
      activate: "Activate",
      duplicate: "Duplicate",
      delete: "Delete",
      atLeastOne: "At least one theme is required.",
      confirmDelete: "Delete this theme?",
      newThemePrompt: "New theme name",
      newThemeDefault: "New Theme",
      copySuffix: "(copy)",
    },
  }[language];

  const brandingSlice = useAdminStore((state) => state.branding);
  const themesSlice = useAdminStore((state) => state.themes);
  const setBranding = useAdminStore((state) => state.setBranding);
  const setThemes = useAdminStore((state) => state.setThemes);
  const setEditor = useAdminUi((state) => state.setEditor);
  const clearEditor = useAdminUi((state) => state.clearEditor);

  const [branding, setBrandingDraft] = useState<Branding>(() =>
    structuredClone(brandingSlice),
  );
  const [themes, setThemesDraft] = useState<Themes>(() =>
    structuredClone(themesSlice),
  );

  const brandingDirty = useEntityDirty("branding.json", branding);
  const themesDirty = useEntityDirty("themes.json", themes);
  const dirty = brandingDirty || themesDirty;

  const save = async () => {
    setBranding(branding);
    setThemes(themes);
    await downloadJson("branding.json", branding);
    await downloadJson("themes.json", themes);
  };

  // This page edits two files, so it registers its own editor instead of PageHeader.
  useEffect(() => {
    setEditor({ dirty, filename: "branding.json", save });
    return () => clearEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // --- branding helpers ---
  const setBrandScalar = (
    key: "companyName" | "shortName" | "logoUrl" | "logoUrlDark" | "faviconUrl",
    value: string,
  ) => setBrandingDraft((prev) => ({ ...prev, [key]: value }));

  const setTagline = (lang: "es" | "en", value: string) =>
    setBrandingDraft((prev) => ({
      ...prev,
      tagline: { ...prev.tagline, [lang]: value },
    }));

  // --- theme helpers ---
  const updateTheme = (index: number, patch: Partial<Theme>) =>
    setThemesDraft((prev) =>
      prev.map((theme, i) => (i === index ? { ...theme, ...patch } : theme)),
    );

  const updateColor = (
    index: number,
    key: keyof Theme["colors"],
    value: string,
  ) =>
    setThemesDraft((prev) =>
      prev.map((theme, i) =>
        i === index
          ? { ...theme, colors: { ...theme.colors, [key]: value } }
          : theme,
      ),
    );

  const activateTheme = (index: number) =>
    setThemesDraft((prev) =>
      prev.map((theme, i) => ({ ...theme, isActive: i === index })),
    );

  const duplicateTheme = (index: number) =>
    setThemesDraft((prev) => {
      const source = prev[index];
      const copy: Theme = {
        ...structuredClone(source),
        id: `${source.id}-copy-${Date.now()}`,
        name: `${source.name} ${T.copySuffix}`,
        isActive: false,
      };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });

  const deleteTheme = (index: number) => {
    if (themes.length <= 1) {
      alert(T.atLeastOne);
      return;
    }
    if (!confirm(T.confirmDelete)) return;
    setThemesDraft((prev) => {
      const removed = prev[index];
      const next = prev.filter((_, i) => i !== index);
      // Ensure exactly one theme stays active.
      if (removed.isActive && !next.some((t) => t.isActive) && next.length) {
        next[0] = { ...next[0], isActive: true };
      }
      return next;
    });
  };

  const addTheme = () => {
    const name = prompt(T.newThemePrompt, T.newThemeDefault);
    if (name === null) return;
    setThemesDraft((prev) => [...prev, emptyTheme(name)]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-foreground">{T.title}</h1>
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={addTheme}
        >
          {T.addTheme}
        </button>
      </div>

      {/* ---------- Branding ---------- */}
      <BilingualSection title={T.branding}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label={T.companyName}
            value={branding.companyName}
            placeholder="José Pablo Campos Solano"
            onChange={(value) => setBrandScalar("companyName", value)}
          />
          <TextField
            label={T.shortName}
            value={branding.shortName}
            placeholder="José Pablo Campos"
            onChange={(value) => setBrandScalar("shortName", value)}
          />
        </div>
        <BilingualField
          label={T.tagline}
          es={branding.tagline.es}
          en={branding.tagline.en}
          onChange={setTagline}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <MediaPicker
            label={T.logoUrl}
            value={branding.logoUrl}
            onChange={(value) => setBrandScalar("logoUrl", value)}
          />
          <MediaPicker
            label={T.logoUrlDark}
            value={branding.logoUrlDark}
            onChange={(value) => setBrandScalar("logoUrlDark", value)}
          />
        </div>
        <MediaPicker
          label={T.faviconUrl}
          value={branding.faviconUrl}
          onChange={(value) => setBrandScalar("faviconUrl", value)}
        />
      </BilingualSection>

      {/* ---------- Themes ---------- */}
      <BilingualSection title={T.themes}>
        <div className="space-y-4">
          {themes.map((theme, index) => (
            <div
              key={theme.id}
              className="border border-border rounded-md p-4 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className="h-4 w-4 rounded-full border border-border shrink-0"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <input
                    type="text"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
                    value={theme.name}
                    placeholder={T.themeName}
                    onChange={(e) =>
                      updateTheme(index, { name: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {theme.isActive ? (
                    <span className="text-xs font-semibold text-accent">
                      {T.active}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="text-xs text-accent hover:underline"
                      onClick={() => activateTheme(index)}
                    >
                      {T.activate}
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-xs text-accent hover:underline"
                    onClick={() => duplicateTheme(index)}
                  >
                    {T.duplicate}
                  </button>
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline"
                    onClick={() => deleteTheme(index)}
                  >
                    {T.delete}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {COLOR_KEYS.map(({ key, label }) => (
                  <ColorField
                    key={key}
                    label={label[language]}
                    value={theme.colors[key]}
                    onChange={(value) => updateColor(index, key, value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={addTheme}
        >
          {T.addTheme}
        </button>
      </BilingualSection>

      <FloatingSaveButton dirty={dirty} onSave={save} />
    </div>
  );
}

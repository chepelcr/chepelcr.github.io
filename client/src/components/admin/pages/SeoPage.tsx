import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  BilingualSection,
  BilingualField,
  BilingualTextArea,
  TextField,
} from "@/components/admin/AdminUI";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useLanguage } from "@/contexts/language-context";
import seoData from "@/content/seo.json";

type Seo = typeof seoData;
type Route = Seo["routes"][keyof Seo["routes"]];

export default function SeoPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      site: "Sitio",
      siteUrl: "URL del sitio",
      ogImage: "Imagen OG",
      twitterHandle: "Usuario de Twitter",
      defaults: "Valores predeterminados",
      defaultTitle: "Título predeterminado",
      defaultDescription: "Descripción predeterminada",
      keywords: "Palabras clave",
      keywordsHint: "Palabras clave separadas por comas, por idioma.",
      routes: "Rutas",
      route: "Ruta",
      remove: "Quitar",
      routeKey: "Clave de ruta",
      title: "Título",
      description: "Descripción",
      addRoute: "+ Añadir ruta",
    },
    en: {
      site: "Site",
      siteUrl: "Site URL",
      ogImage: "OG Image",
      twitterHandle: "Twitter Handle",
      defaults: "Defaults",
      defaultTitle: "Default Title",
      defaultDescription: "Default Description",
      keywords: "Keywords",
      keywordsHint: "Comma-separated keywords per language.",
      routes: "Routes",
      route: "Route",
      remove: "Remove",
      routeKey: "Route Key",
      title: "Title",
      description: "Description",
      addRoute: "+ Add route",
    },
  }[language];

  const slice = useAdminStore((state) => state.seo);
  const setSeo = useAdminStore((state) => state.setSeo);

  const [draft, setDraft] = useState<Seo>(structuredClone(slice));

  const setScalar = (key: "siteUrl" | "ogImage" | "twitterHandle", value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const setBilingual = (
    key: "defaultTitle" | "defaultDescription" | "keywords",
    lang: "es" | "en",
    value: string,
  ) => {
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: value } }));
  };

  // Routes are keyed entries; manage them as an ordered list of [key, value] pairs.
  const routeEntries = Object.entries(draft.routes) as Array<[string, Route]>;

  const setRoutes = (entries: Array<[string, Route]>) =>
    setDraft((prev) => ({
      ...prev,
      routes: Object.fromEntries(entries) as Seo["routes"],
    }));

  const updateRouteKey = (index: number, newKey: string) =>
    setRoutes(routeEntries.map(([key, value], i) => (i === index ? [newKey, value] : [key, value])));

  const updateRoute = (index: number, patch: Partial<Route>) =>
    setRoutes(
      routeEntries.map(([key, value], i) =>
        i === index ? [key, { ...value, ...patch }] : [key, value],
      ),
    );

  const addRoute = () =>
    setRoutes([
      ...routeEntries,
      ["", { title: { es: "", en: "" }, description: { es: "", en: "" } }],
    ]);

  const removeRoute = (index: number) =>
    setRoutes(routeEntries.filter((_, i) => i !== index));

  const save = async () => {
    setSeo(draft);
    await downloadJson("seo.json", draft);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="SEO" entity="seo.json" value={draft} onSave={save} />

      <BilingualSection title={T.site}>
        <TextField
          label={T.siteUrl}
          value={draft.siteUrl}
          placeholder="https://jcampos.dev"
          onChange={(value) => setScalar("siteUrl", value)}
        />
        <MediaPicker
          label={T.ogImage}
          value={draft.ogImage}
          onChange={(value) => setScalar("ogImage", value)}
        />
        <TextField
          label={T.twitterHandle}
          value={draft.twitterHandle}
          placeholder="@handle"
          onChange={(value) => setScalar("twitterHandle", value)}
        />
      </BilingualSection>

      <BilingualSection title={T.defaults}>
        <BilingualField
          label={T.defaultTitle}
          es={draft.defaultTitle.es}
          en={draft.defaultTitle.en}
          onChange={(lang, value) => setBilingual("defaultTitle", lang, value)}
        />
        <BilingualTextArea
          label={T.defaultDescription}
          es={draft.defaultDescription.es}
          en={draft.defaultDescription.en}
          onChange={(lang, value) => setBilingual("defaultDescription", lang, value)}
        />
        <BilingualTextArea
          label={T.keywords}
          es={draft.keywords.es}
          en={draft.keywords.en}
          hint={T.keywordsHint}
          onChange={(lang, value) => setBilingual("keywords", lang, value)}
        />
      </BilingualSection>

      <BilingualSection title={T.routes}>
        {routeEntries.map(([key, route], index) => (
          <div key={index} className="border border-border rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {T.route} #{index + 1}
              </span>
              <button
                type="button"
                className="text-xs text-destructive hover:underline"
                onClick={() => removeRoute(index)}
              >
                {T.remove}
              </button>
            </div>
            <TextField
              label={T.routeKey}
              value={key}
              placeholder="home | projects"
              onChange={(value) => updateRouteKey(index, value)}
            />
            <BilingualField
              label={T.title}
              es={route.title.es}
              en={route.title.en}
              onChange={(lang, value) =>
                updateRoute(index, { title: { ...route.title, [lang]: value } })
              }
            />
            <BilingualTextArea
              label={T.description}
              es={route.description.es}
              en={route.description.en}
              onChange={(lang, value) =>
                updateRoute(index, { description: { ...route.description, [lang]: value } })
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={addRoute}
        >
          {T.addRoute}
        </button>
      </BilingualSection>
    </div>
  );
}

import { useEffect } from "react";
import { getSeo } from "@/repositories/seo.repository";
import { pickLang, type Lang } from "@/lib/i18n-field";
import { absoluteAssetUrl } from "@/lib/media";

export interface ResolvedSeo {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  ogUrl: string;
}

/** Resolve SEO metadata for a given route key + language. */
export function resolveSeo(section: string | undefined, lang: Lang): ResolvedSeo {
  const seo = getSeo();
  const routes = (seo.routes ?? {}) as Record<
    string,
    { title?: { es?: string; en?: string }; description?: { es?: string; en?: string } }
  >;

  const key = section && routes[section] ? section : "home";
  const route = routes[key];

  const title = pickLang(route?.title, lang) || pickLang(seo.defaultTitle, lang);
  const description =
    pickLang(route?.description, lang) || pickLang(seo.defaultDescription, lang);
  const keywords = pickLang(seo.keywords, lang);

  const ogImage = absoluteAssetUrl(seo.ogImage);
  const siteUrl = (seo.siteUrl ?? "").replace(/\/$/, "");
  const path = key === "home" ? `/${lang}` : `/${lang}/${key}`;
  const ogUrl = `${siteUrl}${path}`;

  return { title, description, keywords, ogImage, ogUrl };
}

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Update document.title and the description / Open Graph meta tags
 * whenever the route section or language changes.
 */
export function useHeadTags(lang: Lang, section?: string): void {
  useEffect(() => {
    const meta = resolveSeo(section, lang);

    document.title = meta.title;
    document.documentElement.lang = lang;

    upsertMeta('meta[name="description"]', "name", "description", meta.description);
    upsertMeta('meta[name="keywords"]', "name", "keywords", meta.keywords);
    upsertMeta('meta[property="og:title"]', "property", "og:title", meta.title);
    upsertMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      meta.description,
    );
    upsertMeta('meta[property="og:image"]', "property", "og:image", meta.ogImage);
    upsertMeta('meta[property="og:url"]', "property", "og:url", meta.ogUrl);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
    upsertMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      meta.description,
    );
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", meta.ogImage);
  }, [lang, section]);
}

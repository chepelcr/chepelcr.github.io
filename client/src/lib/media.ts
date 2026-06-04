import seo from "@/content/seo.json";
import type { MediaItem } from "@/repositories/media.repository";

/**
 * Resolve an asset reference to a usable URL.
 * - Absolute (http/https) and data: URLs pass through unchanged.
 * - Root-relative refs ("/foo.png") get the Vite BASE_URL prefix
 *   (without producing a double slash).
 * - Empty/undefined refs return "".
 */
export function resolveAssetUrl(ref?: string): string {
  if (!ref) return "";
  if (/^(https?:)?\/\//i.test(ref) || ref.startsWith("data:")) return ref;

  if (ref.startsWith("/")) {
    const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
    return `${base}${ref}`;
  }

  return ref;
}

/** Resolve the URL for a media library item. */
export function resolveMediaUrl(item?: MediaItem): string {
  return resolveAssetUrl(mediaRef(item));
}

/** Extract the raw stored reference from a media item (empty-string aware). */
export function mediaRef(item?: MediaItem): string {
  if (!item) return "";
  const it = item as { source?: string; path?: string; url?: string };
  if (it.source === "external") return it.url || it.path || "";
  return it.path || it.url || "";
}

/**
 * Build an absolute URL (for SEO/OG tags) by joining a ref with the
 * configured site URL. Absolute/data refs pass through unchanged.
 */
export function absoluteAssetUrl(ref?: string): string {
  if (!ref) return "";
  if (/^(https?:)?\/\//i.test(ref) || ref.startsWith("data:")) return ref;

  const resolved = resolveAssetUrl(ref);
  const siteUrl = (seo.siteUrl ?? "").replace(/\/$/, "");
  const path = resolved.startsWith("/") ? resolved : `/${resolved}`;
  return `${siteUrl}${path}`;
}

import { getActiveTheme, type Theme } from "@/repositories/themes.repository";
import { getBranding } from "@/repositories/branding.repository";
import { resolveAssetUrl } from "@/lib/media";

const STYLE_ID = "brand-theme";
const FAVICON_ID = "brand-favicon";

/**
 * Convert a hex color (#rgb / #rrggbb) into a CSS HSL component string
 * "H S% L%" suitable for use inside hsl(...) or as raw HSL channels.
 */
export function hexToHsl(hex: string): string {
  let value = hex.trim().replace(/^#/, "");

  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return `${h} ${sPct}% ${lPct}%`;
}

/**
 * Apply a theme by upserting a managed <style id="brand-theme"> element.
 *
 * - --brand-* tokens are exposed on :root for reference.
 * - --navy / --slate are emitted as FULL hsl(...) strings (index.css
 *   consumes them as var(--navy) directly, including in .gradient-bg).
 * - Light-mode semantic tokens (--accent, --primary, --background) are
 *   scoped to ':root:not(.dark)' so the .dark block in index.css wins
 *   for dark mode.
 */
export function applyBrandTheme(theme?: Theme): void {
  const active = theme ?? getActiveTheme();
  if (!active?.colors) return;

  const c = active.colors;

  const accentHsl = hexToHsl(c.accent);
  const primaryHsl = hexToHsl(c.primary);
  const backgroundHsl = hexToHsl(c.background);
  const navyLightHsl = hexToHsl(c.navyLight);
  const slateLightHsl = hexToHsl(c.slateLight);
  const navyDarkHsl = hexToHsl(c.navyDark);
  const slateDarkHsl = hexToHsl(c.slateDark);

  const css = `:root {
  --brand-accent: ${c.accent};
  --brand-primary: ${c.primary};
  --brand-background: ${c.background};
  --brand-navy-light: ${c.navyLight};
  --brand-slate-light: ${c.slateLight};
  --brand-navy-dark: ${c.navyDark};
  --brand-slate-dark: ${c.slateDark};
  --navy: hsl(${navyLightHsl});
  --slate: hsl(${slateLightHsl});
}
:root:not(.dark) {
  --accent: hsl(${accentHsl});
  --primary: hsl(${primaryHsl});
  --background: hsl(${backgroundHsl});
  --ring: hsl(${accentHsl});
}
.dark {
  --navy: hsl(${navyDarkHsl});
  --slate: hsl(${slateDarkHsl});
  --accent: hsl(${accentHsl});
  --primary: hsl(${primaryHsl});
  --ring: hsl(${accentHsl});
}`;

  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

/** Upsert a <link rel="icon"> using a resolved asset reference. */
export function applyFavicon(ref?: string): void {
  const href = resolveAssetUrl(ref);
  if (!href) return;

  let link = document.getElementById(FAVICON_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = FAVICON_ID;
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
}

/** Read active theme + branding from repositories and apply both. */
export function initBrand(): void {
  applyBrandTheme(getActiveTheme());

  const branding = getBranding();
  applyFavicon(branding.faviconUrl);
}

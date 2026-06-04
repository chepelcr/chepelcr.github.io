# CLAUDE.md — Portfolio / PDF CV Generator

Personal portfolio and bilingual PDF CV generator for José Pablo Campos Solano (Solutions Architect).
Live at: **https://www.jcampos.dev/**

---

## Project Overview

Full-stack application with two deployment modes:
- **Static (GitHub Pages):** Client-only — portfolio, dark/light mode, language switching, jsPDF export
- **Full server (Replit):** Adds contact form email via Amazon SES, PostgreSQL database, session auth

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 |
| Routing | Wouter 3 |
| Styling | Tailwind CSS 3 + CSS variables |
| UI primitives | Radix UI + shadcn/ui (New York style) |
| Forms | React Hook Form + Zod |
| Server state | TanStack React Query 5 |
| Admin state | Zustand 5 (dev-only admin store) |
| Content | Bundled JSON files (`client/src/content/*.json`) |
| PDF generation | jsPDF 3 + html2canvas |
| Animations | Framer Motion 11 |
| Theming | next-themes + content-driven `themes.json` / `branding.json` |
| Backend | Express 4 + TypeScript |
| ORM | Drizzle ORM (PostgreSQL / Neon) |
| Auth | Passport.js (local strategy) |
| Email | Nodemailer + Amazon SES SMTP |
| Build | Vite 5 (client) + ESBuild (server) |
| Package manager | **pnpm** (npm forbidden — `preinstall` guard) |
| Language | TypeScript 5.6 (strict) |

---

## Directory Structure

```
root/
├── client/
│   ├── src/
│   │   ├── App.tsx                     # Router root (mounts /admin only when ADMIN_ENABLED)
│   │   ├── main.tsx                    # Entry point
│   │   ├── index.css                   # Tailwind + CSS variable theme
│   │   ├── content/                    # ★ Bundled JSON content (single source of truth)
│   │   │   ├── personal-info.json      hero.json  about.json  skills.json
│   │   │   ├── experience.json  education.json  certifications.json  training.json
│   │   │   ├── projects.json  contact.json  navigation.json  footer.json
│   │   │   ├── seo.json                 # SEO metadata (per-route titles/descriptions)
│   │   │   ├── branding.json            # Site identity (name, tagline, logo, favicon)
│   │   │   ├── themes.json              # Theme palette presets (accent/bg colors)
│   │   │   ├── media.json               # Media library manifest
│   │   │   └── inventory.json           # Generated module-dependency graph (pnpm inventory)
│   │   ├── translations/               # ★ Flat UI-chrome strings (t("dot.key"))
│   │   │   ├── es.json
│   │   │   └── en.json
│   │   ├── repositories/               # ★ ONLY import site of each content JSON
│   │   │   └── <entity>.repository.ts   # get<Entity>() + exported type
│   │   ├── services/                   # ★ Filter/sort/group logic over collections
│   │   │   ├── cv.service.ts            # Assembles CVData for app + PDF from repos
│   │   │   ├── skills.service.ts  experience.service.ts
│   │   │   ├── projects.service.ts  training.service.ts
│   │   ├── components/
│   │   │   ├── ui/                     # shadcn/ui components (do not edit manually)
│   │   │   ├── admin/                  # ★ DEV-ONLY admin CMS (tree-shaken from prod)
│   │   │   │   ├── AdminRouter.tsx  AdminLayout.tsx  AdminSidebar.tsx  AdminTopbar.tsx
│   │   │   │   ├── FloatingSaveButton.tsx  UnsavedChangesModal.tsx  Modal.tsx
│   │   │   │   └── pages/              # One edit page per content entity + platform pages
│   │   │   ├── *-section.tsx           # Portfolio sections (hero, about, skills, etc.)
│   │   │   ├── navigation.tsx  footer.tsx
│   │   │   ├── theme-provider.tsx  theme-toggle.tsx  language-toggle.tsx
│   │   ├── admin/
│   │   │   └── manifest.ts             # Admin nav manifest (file → route → icon → group)
│   │   ├── pages/
│   │   │   ├── home.tsx  projects.tsx  not-found.tsx
│   │   ├── contexts/
│   │   │   └── language-context.tsx    # Lang state + t() backed by translations/*.json
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx  use-scroll-spy.tsx  use-toast.ts
│   │   ├── lib/
│   │   │   ├── i18n-field.ts            # pickLang(field, lang) bilingual resolver
│   │   │   ├── icons.ts                 # resolveIcon(name) + ICON_NAMES picker list
│   │   │   ├── admin-enabled.ts         # ADMIN_ENABLED gate (DEV || VITE_ENABLE_ADMIN)
│   │   │   ├── admin-store.ts           # Zustand store: loaded content + dirty tracking
│   │   │   ├── admin-ui.ts              # Shared admin UI helpers
│   │   │   ├── local-cms.ts             # Client → /__local/* fetch wrappers (dev only)
│   │   │   ├── brand-theme.ts           # Applies themes.json/branding.json to CSS vars
│   │   │   ├── media.ts  seo.ts  phone.ts  queryClient.ts  utils.ts
│   │   └── utils/
│   │       └── pdf-generator.ts        # jsPDF CV export (consumes cv.service)
│   ├── public/
│   │   ├── profile-photo.png  CNAME  404.html  robots.txt  sitemap.xml  favicon.svg
│   │   └── media/                       # Uploaded assets (written by local CMS)
│   └── index.html
├── server/
│   ├── index.ts                        # Express setup, request logging, port 9100
│   ├── routes.ts                       # /api/contact, /api/download-cv; mounts local-cms in dev
│   ├── local-cms.ts                    # ★ DEV-ONLY /__local/* endpoints (file write + git)
│   ├── email.ts                        # Amazon SES + dev mode Nodemailer
│   ├── storage.ts                      # MemStorage (user CRUD)
│   └── vite.ts                         # Vite dev middleware + static serving
├── scripts/
│   └── build-inventory.mjs             # ★ Generates content/inventory.json (pnpm inventory)
├── shared/
│   └── schema.ts                       # Drizzle schema (users) + Zod types
├── .github/workflows/
│   ├── deploy.yml                      # dev branch → GitHub Pages (pnpm + actions/deploy-pages)
│   └── deploy-page.yml                 # main branch → pnpm + peaceiris/actions-gh-pages
├── vite.config.ts                      # Main Vite config (dev + server build)
├── vite.config.gh-pages.ts             # Static-only build (no Replit plugins)
├── tailwind.config.ts  tsconfig.json  drizzle.config.ts  components.json
├── build-gh-pages.sh                   # Builds to dist/gh-pages/
├── reboot-server.sh                    # pkill + pnpm dev
├── pnpm-lock.yaml                       # pnpm lockfile (replaces package-lock.json)
├── DEPLOYMENT.md
└── package.json                        # preinstall guard: npx only-allow pnpm
```

---

## Package Manager — pnpm

This repo uses **pnpm**, not npm. The `preinstall` script (`npx only-allow pnpm`) blocks
`npm install` / `yarn`. Lockfile is `pnpm-lock.yaml` (migrated from `package-lock.json`).

```bash
pnpm install         # Install deps (CI uses --frozen-lockfile)
pnpm dev             # Dev server: Express + Vite HMR (tsx server/index.ts)
pnpm build           # Vite client build + ESBuild server bundle → dist/
pnpm start           # Production: node dist/index.js
pnpm check           # TypeScript type check (tsc)
pnpm db:push         # Drizzle migrations push to Neon
pnpm inventory       # Regenerate client/src/content/inventory.json (module graph)
```

> pnpm may print a benign "Ignored build scripts: bufferutil, core-js, esbuild" warning
> (default pnpm hardening). The static GH Pages build does not need them.

## Build Scripts

```bash
./build-gh-pages.sh  # Static build → dist/gh-pages/ (copies CNAME + 404.html)
./reboot-server.sh   # Kill server + pnpm dev
```

---

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | — | Neon PostgreSQL connection string |
| `PORT` | 9100 | Express server port |
| `NODE_ENV` | development | Controls Vite middleware vs static serving |
| `AWS_SES_SMTP_USERNAME` | — | Amazon SES SMTP user |
| `AWS_SES_SMTP_PASSWORD` | — | Amazon SES SMTP password |
| `AWS_SES_REGION` | us-east-1 | AWS region |
| `AWS_SES_FROM_EMAIL` | noreply@jcampos.dev | Sender address |
| `AWS_SES_TO_EMAIL` | chepelcr@outlook.com | Recipient for contact form |

---

## Routing Convention

- Language-prefixed URLs: `/{lang}` and `/{lang}/{section}`
- Valid languages: `es`, `en`
- Valid sections: `home`, `about`, `skills`, `experience`, `education`, `projects`, `contact`
- Root `/` redirects to preferred language (localStorage: `portfolio-language`)
- Scroll spy (`use-scroll-spy.tsx`) updates URL as user scrolls
- GitHub Pages SPA: `404.html` redirects query params back to `index.html`

---

## Content System (JSON + Admin CMS)

Content is no longer hardcoded in components. It lives in **bundled JSON files** that flow
through a repository → service → component chain, and is editable via a dev-only admin panel.

### Hard rule: no hardcoded user-visible text

Every user-visible string on the public site must come from an editable source —
either a `client/src/content/*.json` field or an i18n key via `t("dot.key")`
(`client/src/translations/{es,en}.json`). **Never** put a visible literal directly
in a component, and **never** use bilingual ternaries like
`lang === "es" ? "Activo" : "Active"` — that bypasses the content system; resolve
bilingual copy with `pickLang(field, lang)` instead.

- Per-entity copy an editor manages (hero/about/skills/experience copy, project
  taglines…) → `client/src/content/*.json`, with an admin page to edit it.
- Fixed UI chrome / labels shared across the site → i18n keys in
  `client/src/translations/{es,en}.json`.
- Selectable icons are content too: store an `iconName` and resolve via
  `resolveIcon` (`client/src/lib/icons.ts`) — no emoji or icon-per-id maps.
- The only acceptable in-component literals are non-content tokens: `data-testid`,
  class names, decorative `aria-hidden` SVGs, and the literal name "José Pablo
  Campos Solano". Before shipping, audit `client/src/components/*-section.tsx` for
  quoted string literals and asset paths and justify each.

### Content files

- **`client/src/content/*.json`** — structured content entities (one file per section/concern):
  `personal-info`, `hero`, `about`, `skills`, `experience`, `education`, `certifications`,
  `training`, `projects`, `contact`, `navigation`, `footer`, plus platform concerns
  `seo`, `branding`, `themes`, `media`, `inventory`.
- **`client/src/translations/es.json` & `en.json`** — flat UI-chrome strings, consumed via
  `t("dot.key")` from `language-context.tsx`.

### Bilingual field convention

Every translatable copy field is an object `{ "es": "...", "en": "..." }`. Scalars (emails,
URLs, dates, hex colors, tech-stack tokens, enum/level/status tokens, `iconName` strings)
stay plain strings. Resolve with the shared helper:

```ts
import { pickLang } from "@/lib/i18n-field";
pickLang(field, lang); // field?.[lang] ?? field?.es ?? ""
```

### Repository → Service → Component chain

- **Repository** (`client/src/repositories/<entity>.repository.ts`) — the **only** site that
  imports the JSON. Exports a `get<Entity>()` accessor and the derived TS type.
  ```ts
  import data from "@/content/about.json";
  export type About = typeof data;       // singleton
  export function getAbout(){ return data; }
  // collections: export type Project = (typeof data)[number];  (or an explicit interface)
  ```
- **Service** (`client/src/services/<entity>.service.ts`) — filter/sort/group logic over
  collections (e.g. `skills.service`, `experience.service`, `projects.service`).
- **`cv.service.ts`** — assembles the legacy `CVData` shape (personal info, experience,
  education, certifications, training, skills, projects) from the repositories/services,
  resolving bilingual fields for the active language. Consumed by the app and the PDF generator.
- **Component** — section components call the service/repository accessors; they never import
  JSON directly.

### Icons as content

Icons are stored as `iconName` strings and resolved via `resolveIcon(name)` in
`client/src/lib/icons.ts`. `ICON_NAMES` is the admin icon-picker list.

### Rich text

Copy fields may carry light inline formatting via a nestable token syntax
(`\n` line break, `{{ }}`, `[[ ]]`, `(( ))`, `<< >>`, `**bold**`) parsed by
`client/src/lib/rich-text.tsx`. `parseRichText(value)` and the `RichText`
component render the tokens to **React nodes (not HTML)**, so it is XSS-safe;
highlight colours come from theme tokens, never hardcoded hex. Public components
render copy through `parseRichText(...)`; admin textareas show `RICH_TEXT_HINT`
(`richTextHint(lang)` for the localized variant) so editors know the tokens.

### Theming, branding, SEO, media

- **`themes.json`** — palette presets (accent/primary/background/navy/slate colors); the active
  theme is applied to CSS variables by `client/src/lib/brand-theme.ts`.
- **`branding.json`** — site identity (company/short name, logo, dark logo, favicon, tagline).
- **`seo.json`** — site URL + default and per-route titles/descriptions/keywords/OG image,
  applied via `client/src/lib/seo.ts`.
- **`media.json`** — media-library manifest; uploaded assets land in `client/public/media/`.

### Inventory map

`pnpm inventory` runs `scripts/build-inventory.mjs`, which walks `client/src`, resolves
`@/` and relative imports, classifies each module by top-level folder, and writes a
`{ counts, nodes, edges }` dependency graph to `client/src/content/inventory.json`. The admin
Inventory page visualizes it.

**To update content:** use the admin panel (below), or edit the JSON directly — but always
go through a repository accessor in code, never import the JSON elsewhere.

---

## Admin CMS (Dev-Only)

A full content management panel mounted at **`/admin`**, available only in development.

- **Gate** — `client/src/lib/admin-enabled.ts` exports
  `ADMIN_ENABLED = import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN === "true"`.
  `App.tsx` mounts `<Route path="/admin/:rest*" component={AdminRouter} />` only when
  `ADMIN_ENABLED`, so the entire admin tree is **tree-shaken out of production bundles**
  (verified: no admin code or chunk in `dist/`). The admin has **no authentication** — this
  gate is the only thing keeping it off the public site. **Do not weaken it** (never register
  `/admin` unconditionally, never default `VITE_ENABLE_ADMIN` true in CI); verify with a prod
  build + grep that no admin module name appears in `dist/`.
- **Nav manifest** — `client/src/admin/manifest.ts` maps each content file to a route, icon,
  and group (`content` / `cms` / `platform`). Pages live in `client/src/components/admin/pages/`
  (one per entity, plus Translations, Site Identity, Media, Content Versions, Content Explorer,
  Inventory, Diagnostics, Dashboard).
- **State** — `client/src/lib/admin-store.ts` is a Zustand store holding loaded content and
  dirty-tracking; `FloatingSaveButton` + `UnsavedChangesModal` drive the Save/Publish UX.

### Content ↔ admin completeness (keep complete)

Every `client/src/content/*.json` entity MUST have all four, or it isn't done:
(1) a matching **admin edit page** (`client/src/components/admin/pages/`), (2) an
entry in the **manifest** (`client/src/admin/manifest.ts` → sidebar), (3) a
**route** in `AdminRouter`, and (4) a **download row** in Content Versions. When
you rename/merge a page, add a redirect from the old route (e.g.
`/admin/branding` and `/admin/themes` both redirect to `/admin/identity`, which
edits branding.json + themes.json together). `inventory.json` is itself a content
entity, so regenerate it (`pnpm inventory`) after adding/removing/renaming any
`client/src` file so the map and InventoryPage stay accurate.

### Bilingual admin chrome + language toggle

The admin chrome (sidebar items, group headings, dashboard, topbar buttons,
page-header titles) is **bilingual**, following an **in-panel language toggle**
in the topbar (default Spanish). Labels are language-aware — `manifest.ts` carries
a `BiLabel { es, en }` per page/group (`labelForFile(file, lang)` /
`GROUP_LABELS[group][lang]`), never hardcoded single-language strings.

**Admin-safe language switch:** inside `/admin` there is no language-prefixed URL
to navigate to, so the shared `setLanguage` (`language-context.tsx`) **guards** on
`location.startsWith("/admin")`: it sets the language state + persists it and
**returns in place** — no navigate, no page-transition animation — otherwise it
would kick the author out of the admin. The public path keeps its
navigate-to-`/{lang}/{section}` + slide animation.

Admin content pages edit **both languages side by side** via the bilingual
primitives in `AdminUI.tsx` (`BilingualField` / `BilingualTextArea`, props
`es`/`en` + `onChange(lang, value)`). Do **not** add a per-page "editing language"
toggle or read `field[lang]` for editing — write `es` and `en` directly.

### Save / Publish flow

The admin client talks to dev-only Express endpoints via `client/src/lib/local-cms.ts`:

| Endpoint | Method | Purpose |
|---|---|---|
| `/__local/content` | POST | Write a content/translation JSON file (validated filename) |
| `/__local/asset` | POST | Decode a data-URL and write under `client/public[/media]` (≤ 25 MB) |
| `/__local/publish` | POST | `git add` tracked dirs → commit → push current branch |
| `/__local/git-status` | GET | Porcelain status of tracked content dirs |
| `/__local/git-log` | GET | Paginated commit log (for Content Versions) |

- **Save** writes the edited entity to its JSON file on disk (`/__local/content`).
- **Publish** stages `client/src/content`, `client/src/translations`, `client/public`, commits
  (`content: update via local CMS <ISO>`), and pushes the current branch — which triggers the
  GitHub Pages deploy.
- These endpoints are registered (`registerLocalCmsRoutes`) **only when
  `app.get("env") === "development"`** and additionally reject any non-loopback Host header,
  so they can never run on the static deployment.

---

## PDF Generation

Client-side only via **`client/src/utils/pdf-generator.ts`**:
- Uses jsPDF 3 + html2canvas 1.4
- Generates bilingual CV based on current language
- Triggered from hero section "Download CV" button
- No server involvement — works on GitHub Pages static deployment

---

## API Endpoints (Server Only)

| Method | Path | Description |
|---|---|---|
| POST | `/api/contact` | Contact form — validates fields, sends email via SES |
| GET | `/api/download-cv` | Placeholder (client-side PDF generation is primary path) |

Contact form validation: name, email (regex), subject, message — all required.
Error messages are in Spanish.

**Dev-only `/__local/*` endpoints** (registered only in development; see Admin CMS section):
`/__local/content`, `/__local/asset`, `/__local/publish`, `/__local/git-status`,
`/__local/git-log`. Loopback Host required; never present on the static deployment.

---

## Styling Conventions

- **Tailwind CSS with CSS variables** — theme switching is CSS-variable-based, not class-swapping
- Dark mode: `class` strategy (`dark` class on `<html>`)
- Custom utility classes in `index.css`:
  - `.section-spacing` — vertical section padding
  - `.container-spacing` — horizontal container padding
  - `.gradient-bg` — section background gradients
- Responsive breakpoints: mobile-first; `lg:` for desktop layouts (`flex-col lg:flex-row`)
- shadcn/ui components are in `client/src/components/ui/` — prefer editing via shadcn CLI or carefully by hand

---

## Database

Minimal schema (Drizzle ORM + Neon PostgreSQL):
```sql
users (id UUID PK, username TEXT UNIQUE, password TEXT)
```
Only used for potential future authentication. Current contact form does not require auth.

---

## Deployment Pipelines

| Trigger | Workflow | Output |
|---|---|---|
| Push to `dev` | `.github/workflows/deploy.yml` | GitHub Pages via `actions/deploy-pages@v4` |
| Push to `main` | `.github/workflows/deploy-page.yml` | GitHub Pages via `peaceiris/actions-gh-pages@v3` |

Both workflows: checkout → `pnpm/action-setup@v4` → Node 20 (`cache: 'pnpm'`) →
`pnpm install --frozen-lockfile` → `pnpm exec vite build` → copy CNAME → deploy.

**Static build** (`vite.config.gh-pages.ts`): base `/`, output `dist/gh-pages`, React plugin only (no Replit plugins).

---

## Key Architectural Decisions

1. **Single package.json at root** — no separate client/server packages; Vite handles client bundling, ESBuild handles server bundling.
2. **pnpm only** — `preinstall: npx only-allow pnpm` blocks npm/yarn; lockfile is `pnpm-lock.yaml`.
3. **JSON content, not hardcoded copy** — all content lives in `client/src/content/*.json` and
   `client/src/translations/*.json`, reached through repositories/services. Components never
   import content JSON directly.
4. **Repository = single import site** — each content JSON is imported in exactly one
   repository file, which exports the derived type and accessor.
5. **Dev-only admin CMS** — gated by `ADMIN_ENABLED`, tree-shaken from prod; edits are written
   to disk and `git`-published via dev-only `/__local/*` Express endpoints.
6. **Wouter not React Router** — lightweight, hash/path routing, used with `useLocation` hook.
7. **Context API for language** — no external i18n library; `t()` reads `translations/*.json`.
8. **Client-side PDF** — jsPDF runs in browser via `cv.service`; the server `/api/download-cv`
   endpoint is a stub.
9. **Two Vite configs** — `vite.config.ts` for full dev/server build; `vite.config.gh-pages.ts`
   for pure static export.
10. **Path aliases**: `@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` → `attached_assets/`.

---

## Common Tasks

### Edit content (preferred)
Run `pnpm dev`, open **http://localhost:9100/admin**, edit a section, **Save** (writes the
entity's JSON), then **Publish** (commits + pushes → triggers deploy). Or edit the JSON in
`client/src/content/` directly.

### Add a new content entity
1. Add `client/src/content/<entity>.json` (bilingual fields as `{es,en}` objects).
2. Add `client/src/repositories/<entity>.repository.ts` (the only import of that JSON).
3. Add a service if it's a collection needing filter/sort/group logic.
4. Consume it in the section component via the accessor (never import the JSON directly);
   render copy via `parseRichText(...)` and resolve bilingual fields with `pickLang`.
5. Complete the four admin pieces: add an edit page in
   `client/src/components/admin/pages/`, register it in `client/src/admin/manifest.ts`
   (with a `BiLabel` + group → sidebar), add its route in `AdminRouter`, and confirm it
   appears in Content Versions. Then run `pnpm inventory`.

### Add a UI-chrome string
Add the key to **both** `client/src/translations/es.json` and `en.json`, then use `t("dot.key")`.

### Add a new UI component
```bash
pnpm dlx shadcn@latest add <component>
```
Components land in `client/src/components/ui/`.

### Regenerate the inventory graph
```bash
pnpm inventory
```

### Run database migrations
```bash
pnpm db:push
```
Requires `DATABASE_URL` env variable pointing to Neon.

### Deploy to GitHub Pages
Push to `dev` branch (or **Publish** from the admin panel) — GitHub Actions handles the rest.

# José Pablo Campos Solano — Portfolio & CV

Personal portfolio and **bilingual (Español / English) PDF CV generator** for José Pablo
Campos Solano, Solutions Architect.

**Live:** https://www.jcampos.dev/

The site is a single-page React app with language-prefixed routes (`/es`, `/en`), dark/light
mode, and a client-side PDF export of the CV. All content is driven by bundled JSON files and
edited through a dev-only admin panel — there is **no runtime backend** in production, so the
whole site deploys as static files to GitHub Pages.

---

## Tech Stack

- **Frontend:** React 18, Wouter 3 (routing), Tailwind CSS 3 + CSS variables, Radix UI /
  shadcn/ui (New York style), Framer Motion, TanStack React Query
- **Content:** bundled JSON in `client/src/content/*.json` + flat UI translations in
  `client/src/translations/{es,en}.json`
- **PDF:** jsPDF 3 + html2canvas (generated in the browser)
- **Admin state:** Zustand 5 (dev-only)
- **Dev server / contact form:** Express 4 + TypeScript, Nodemailer + Amazon SES, Drizzle ORM
- **Build:** Vite 5 (client) + ESBuild (server)
- **Package manager:** pnpm (npm is blocked by a `preinstall` guard)
- **Language:** TypeScript 5.6 (strict)

---

## Getting Started

Requires **Node 20+** and **pnpm** (npm/yarn are intentionally blocked).

```bash
pnpm install     # install dependencies
pnpm dev         # start the dev server at http://localhost:9100
```

Other scripts:

```bash
pnpm build       # production build → dist/
pnpm start       # run the production server
pnpm check       # TypeScript type check
pnpm inventory   # regenerate the module dependency graph (content/inventory.json)
```

---

## Editing Content

Content is **not** hardcoded in components — it lives in JSON files and is edited through a
built-in admin CMS that runs only in development.

1. Run `pnpm dev`.
2. Open **http://localhost:9100/admin**.
3. Pick a section in the sidebar (Hero, About, Skills, Experience, Projects, SEO, Site
   Identity, Media, Translations, …) and edit the fields. Bilingual fields have separate ES/EN
   inputs.
4. Click **Save** — the edited entity is written back to its JSON file on disk.
5. Click **Publish** — the changed content files are committed and pushed to the current
   branch, which triggers the GitHub Pages deploy.

You can also edit the JSON files under `client/src/content/` directly.

> The admin panel and its write-back endpoints exist only in development. They are gated by
> `ADMIN_ENABLED` and tree-shaken out of the production bundle, and the file-write / git
> endpoints reject any non-loopback request — so they can never run on the live static site.

### Content layout

```
client/src/
├── content/                # structured content (one JSON file per concern)
│   ├── personal-info.json  hero.json  about.json  skills.json
│   ├── experience.json  education.json  certifications.json  training.json
│   ├── projects.json  contact.json  navigation.json  footer.json
│   ├── seo.json            # per-route SEO metadata
│   ├── branding.json       # site identity (name, tagline, logo, favicon)
│   ├── themes.json         # color palette presets
│   ├── media.json          # media library manifest
│   └── inventory.json      # generated module dependency graph
├── translations/
│   ├── es.json             # flat UI-chrome strings (t("dot.key"))
│   └── en.json
├── repositories/           # the only place each content JSON is imported
└── services/               # filter/sort/group logic + cv.service (PDF data)
```

**Bilingual fields** are objects `{ "es": "...", "en": "..." }`; scalars (emails, URLs, dates,
hex colors, tech tokens, icon names) stay plain strings.

---

## Build & Deploy

The site deploys to **GitHub Pages** automatically via GitHub Actions:

- Push to **`dev`** → builds and deploys via `.github/workflows/deploy.yml`.
- Push to **`main`** → builds and deploys via `.github/workflows/deploy-page.yml`.

Both workflows install with `pnpm install --frozen-lockfile`, run `pnpm exec vite build`, copy
the `CNAME`, and publish the static output.

For a local static build:

```bash
./build-gh-pages.sh   # → dist/gh-pages/ (includes CNAME + 404.html SPA redirect)
```

---

## Architecture

Content flows through a clean **repository → service → component** chain:

- **Repositories** (`client/src/repositories/<entity>.repository.ts`) are the single import
  site of each content JSON and export the derived TypeScript type plus a `get<Entity>()`
  accessor.
- **Services** (`client/src/services/*.service.ts`) add filtering/sorting/grouping;
  `cv.service.ts` assembles the data the PDF generator and CV view consume.
- **Components** read from services/repositories and resolve bilingual fields with
  `pickLang(field, lang)` from `client/src/lib/i18n-field.ts`. They never import content JSON
  directly.

The dev-only admin CMS edits these same JSON files, so what you see in the panel is exactly
what ships.

---

## License

[MIT](./LICENSE) © José Pablo Campos Solano

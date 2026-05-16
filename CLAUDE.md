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
| PDF generation | jsPDF 3 + html2canvas |
| Animations | Framer Motion 11 |
| Theming | next-themes |
| Backend | Express 4 + TypeScript |
| ORM | Drizzle ORM (PostgreSQL / Neon) |
| Auth | Passport.js (local strategy) |
| Email | Nodemailer + Amazon SES SMTP |
| Build | Vite 5 (client) + ESBuild (server) |
| Language | TypeScript 5.6 (strict) |

---

## Directory Structure

```
root/
├── client/
│   ├── src/
│   │   ├── App.tsx                     # Router root
│   │   ├── main.tsx                    # Entry point
│   │   ├── index.css                   # Tailwind + CSS variable theme
│   │   ├── components/
│   │   │   ├── ui/                     # 47 shadcn/ui components (do not edit manually)
│   │   │   ├── *-section.tsx           # Portfolio sections (hero, about, skills, etc.)
│   │   │   ├── navigation.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   ├── language-toggle.tsx
│   │   │   └── footer.tsx
│   │   ├── pages/
│   │   │   ├── home.tsx                # Single-page app with all sections
│   │   │   ├── projects.tsx            # Dedicated projects showcase
│   │   │   └── not-found.tsx
│   │   ├── contexts/
│   │   │   └── language-context.tsx    # All translations (ES/EN) + CVData structure
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx
│   │   │   ├── use-scroll-spy.tsx      # Section scroll tracking → URL updates
│   │   │   └── use-toast.ts
│   │   ├── lib/
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   └── utils/
│   │       └── pdf-generator.ts        # jsPDF CV export logic
│   ├── public/
│   │   ├── profile-photo.png
│   │   ├── CNAME                       # jcampos.dev
│   │   ├── 404.html                    # GitHub Pages SPA redirect
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── favicon.svg
│   └── index.html
├── server/
│   ├── index.ts                        # Express setup, request logging, port 9100
│   ├── routes.ts                       # POST /api/contact, GET /api/download-cv
│   ├── email.ts                        # Amazon SES + dev mode Nodemailer
│   ├── storage.ts                      # MemStorage (user CRUD)
│   └── vite.ts                         # Vite dev middleware + static serving
├── shared/
│   └── schema.ts                       # Drizzle schema (users) + Zod types
├── .github/workflows/
│   ├── deploy.yml                      # dev branch → GitHub Pages (actions/deploy-pages)
│   └── deploy-page.yml                 # main branch → peaceiris/actions-gh-pages
├── vite.config.ts                      # Main Vite config (dev + server build)
├── vite.config.gh-pages.ts             # Static-only build (no Replit plugins)
├── tailwind.config.ts
├── tsconfig.json
├── drizzle.config.ts
├── components.json                     # shadcn/ui config
├── build-gh-pages.sh                   # Builds to dist/gh-pages/
├── reboot-server.sh                    # pkill + npm run dev
├── DEPLOYMENT.md
└── package.json
```

---

## NPM Scripts

```bash
npm run dev          # Dev server: Express + Vite HMR (tsx server/index.ts)
npm run build        # Vite client build + ESBuild server bundle → dist/
npm run start        # Production: node dist/index.js
npm run check        # TypeScript type check
npm run db:push      # Drizzle migrations push to Neon
```

## Build Scripts

```bash
./build-gh-pages.sh  # Static build → dist/gh-pages/ (copies CNAME + 404.html)
./reboot-server.sh   # Kill server + npm run dev
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

## Bilingual Content & CV Data

All translations and CV content live in **`client/src/contexts/language-context.tsx`**:
- `t(key)` function returns translated string for current language
- `cvData` object contains all structured CV data (personal info, experience, education, skills, projects)
- Language persists via `localStorage` key `portfolio-language`
- Theme persists via `localStorage` key `portfolio-theme`

**To update CV content:** edit `language-context.tsx` — both `es` and `en` data blocks.

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

Both workflows: checkout → Node 20 → `npm ci` → vite build → copy CNAME → deploy.

**Static build** (`vite.config.gh-pages.ts`): base `/`, output `dist/gh-pages`, React plugin only (no Replit plugins).

---

## Key Architectural Decisions

1. **Single package.json at root** — no separate client/server packages; Vite handles client bundling, ESBuild handles server bundling.
2. **Wouter not React Router** — lightweight, hash/path routing, used with `useLocation` hook.
3. **Context API for language** — no external i18n library; all strings colocated in `language-context.tsx`.
4. **Client-side PDF** — jsPDF runs in browser; the server `/api/download-cv` endpoint is a stub.
5. **Two Vite configs** — `vite.config.ts` for full dev/server build; `vite.config.gh-pages.ts` for pure static export.
6. **Path aliases**: `@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` → `attached_assets/`.

---

## Common Tasks

### Add/edit a portfolio section
1. Edit translations in `client/src/contexts/language-context.tsx` (both `es` and `en`)
2. Edit the corresponding `client/src/components/*-section.tsx`

### Add a new UI component
```bash
npx shadcn@latest add <component>
```
Components land in `client/src/components/ui/`.

### Update CV content
Edit `cvData` inside `language-context.tsx` — both language variants.

### Run database migrations
```bash
npm run db:push
```
Requires `DATABASE_URL` env variable pointing to Neon.

### Deploy to GitHub Pages
Push to `dev` branch — the GitHub Actions workflow handles the rest automatically.

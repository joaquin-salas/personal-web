# joaquinsalas.dev

Personal portfolio of Joaquín Salas: a CV-style home page, technical articles (things I'm learning,
e.g. Kubernetes, Kafka, Wazuh) and write-ups of projects I've built. Static Astro site in English,
written in TypeScript and styled with Tailwind CSS. Self-hosted on an Oracle Cloud instance behind a
reverse proxy. There is no backend and no database: everything is built to static HTML in `dist/`.

## Principles

- **Keep it simple.** Build only what is needed now. Don't add features, abstractions or
  dependencies "for later". See [Out of scope](#out-of-scope-for-now).
- **Layers are independent.** Content never knows how it's displayed; styling never lives in
  content. Redesigning the site must not require touching a Markdown file.
- **Every file has an obvious place.** If something doesn't fit the structure below, ask before
  inventing a new folder.

## Commands

| Command        | What it does                                             |
| -------------- | -------------------------------------------------------- |
| `pnpm dev`     | Dev server at http://localhost:4321 (drafts visible)     |
| `pnpm check`   | Type-check (`astro check`) + formatting check (Prettier) |
| `pnpm format`  | Format every file with Prettier                          |
| `pnpm build`   | Type-check, then build the static site into `dist/`      |
| `pnpm preview` | Serve `dist/` locally to test the production build       |

Run `pnpm check` after every change and fix all errors and warnings before considering a task done.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Architecture

The site is a build-time pipeline with three layers. Each layer only depends on the one before it:

```
CONTENT (what)              LOGIC (how to find it)      PRESENTATION (how it looks)     OUTPUT
src/content/**/*.md   ──►   src/lib/*.ts          ──►   pages, layouts, components ──►  dist/*.html
src/data/*.ts               queries, sorting, URLs      Tailwind classes live here
```

- **Content**: Markdown (articles, projects) and typed TS data (CV). No logic, no styling.
- **Logic**: plain TypeScript functions such as `getArticles()` or `getFeaturedProjects()`. No markup.
- **Presentation**: Astro pages, layouts and components. They ask `src/lib/` for data and render it.

## Site map

| URL                 | Page                                                       |
| ------------------- | ---------------------------------------------------------- |
| `/`                 | Home: CV + featured projects + latest articles (see below) |
| `/articles/`        | All articles, newest first                                 |
| `/articles/<slug>/` | One article                                                |
| `/projects/`        | All projects                                               |
| `/projects/<slug>/` | One project write-up (a single page, like an article)      |
| `/cv.pdf`           | Downloadable CV (static file in `public/`)                 |

### Home page

A two-column layout on desktop: the left column is sticky, the right one scrolls. On mobile it
collapses to a single column. The structure is inspired by brittanychiang.com, but the visual design
(colors, typography, details) must be our own.

| Section               | Shows                                                                | Data source                       |
| --------------------- | -------------------------------------------------------------------- | --------------------------------- |
| Header (left, sticky) | Name, role, tagline, in-page nav, links (GitHub, LinkedIn, Email)    | `src/data/profile.ts`             |
| About                 | A few paragraphs                                                     | `src/data/profile.ts`             |
| Experience            | Timeline: dates, role at company, summary, highlights, stack         | `src/data/experience.ts`          |
| Education             | Dates, degree, school                                                | `src/data/education.ts`           |
| Projects              | Featured projects (title, description, stack) + link to `/projects/` | `projects` collection, `featured` |
| Articles              | Latest 4 articles (date, title, description) + link to `/articles/`  | `articles` collection             |
| Footer                | Build stamp: build date and commit, "Self-hosted on Oracle Cloud"    | `src/lib/build.ts`                |

Every other page uses `PageLayout`: a single column with `SiteHeader` (star mark + name linking
home, Projects/Articles nav) and `SiteFooter`. Articles and projects add `ProseLayout` on top.

### Design direction ("Albaicín")

The visual identity comes from Granada: lime-washed walls, cypress green, Nasrid tile cobalt and
ochre. Keep it restrained; the oversized condensed name on the home page is the one bold element.

- Palette (tokens in `global.css`): `background` lime wash, `ink` cypress, `muted` sage, `rule`
  plaster, `accent` azulejo blue (links, focus, note callouts), `mark` ochre (only the eight-point
  star mark), `caution` almagra red (warning callouts).
- Type: Bricolage Grotesque (`font-display`: name, headings, UI), Source Serif 4 (`font-serif`: body
  and article text), JetBrains Mono (`font-mono`: code only). Self-hosted via Fontsource.
- Lists, not boxes: projects and articles are rows separated by space, not bordered cards. Tech
  stacks and tags are plain comma-separated text, not chips.
- Structure carries meaning: the timeline line is only on experience because it is chronological.
- No decorative motion (no fade-ins, no hover-lift). Feedback is color/underline on links and a
  visible focus ring.
- Copy says what a link does ("See all projects"), no `→` suffixes, no `A · B · C` meta strings.

## Project structure

```
src/
├── content/                  Markdown content (content collections). No styling.
│   ├── articles/<slug>/index.md   One folder per article; its images live next to it.
│   └── projects/<slug>/index.md   One folder per project; its images live next to it.
├── content.config.ts         Collection schemas (frontmatter is validated at build time).
├── data/                     CV data as typed TS: profile.ts, experience.ts, education.ts.
├── lib/                      Logic with no markup: articles.ts, projects.ts (queries, sorting,
│                             URLs), dates.ts (date formatting), build.ts (build date and commit).
├── pages/                    One file per URL. Fetch data from src/lib/ and compose components.
│   ├── index.astro               → /
│   ├── articles/index.astro      → /articles/
│   ├── articles/[slug].astro     → /articles/<slug>/
│   ├── projects/index.astro      → /projects/
│   └── projects/[slug].astro     → /projects/<slug>/
├── layouts/                  BaseLayout   <html lang="en">, <head>, global CSS. Used by every page.
│                             PageLayout   Single column + SiteHeader + SiteFooter (all but home).
│                             ProseLayout  PageLayout + title, dates, cover, `prose` body.
├── components/               Reusable UI with typed Props: ArticleCard, Callout (for .mdx),
│                             ExperienceItem, ExternalLink, ProjectCard, Section, SectionNav,
│                             SiteHeader, SiteFooter, SocialLinks, StarMark, TagList.
├── assets/                   Images used by components (optimized by Astro).
└── styles/global.css         Font imports, Tailwind, design tokens (`@theme`), prose colors.
public/                       Copied as-is to the site root (favicon.svg, cv.pdf, robots.txt).
```

### Where does new code go?

- A new URL → a file in `src/pages/`.
- Markup used in more than one place, or a self-contained block → `src/components/`.
- Logic without markup (queries, sorting, URL building, date formatting) → `src/lib/`.
- CV-style structured data → `src/data/`. Anything with a long body → `src/content/`.
- Images used by an article/project → inside its folder. Images used by components → `src/assets/`.
  Files that must keep an exact URL (cv.pdf, favicon, robots.txt) → `public/`.

## Content

### Articles and projects

- Path: `src/content/articles/<slug>/index.md` or `src/content/projects/<slug>/index.md` (`.mdx` is
  fine when a post needs components). The folder name is the URL slug.
- Slugs are lowercase kebab-case and never change once published (they are URLs).
- Frontmatter is validated by `src/content.config.ts`:

| Field         | Articles | Projects | Notes                                              |
| ------------- | -------- | -------- | -------------------------------------------------- |
| `title`       | required | required |                                                    |
| `description` | required | required | One or two sentences; used in cards and `<meta>`.  |
| `pubDate`     | required | required |                                                    |
| `updatedDate` | optional | optional |                                                    |
| `tags`        | optional | —        | e.g. `["kubernetes", "networking"]`                |
| `stack`       | —        | required | Technologies used, e.g. `["Go", "Kafka"]`          |
| `repo`        | —        | optional | URL                                                |
| `demo`        | —        | optional | URL                                                |
| `featured`    | —        | optional | `true` shows the project on the home page          |
| `cover`       | optional | optional | `{ src: ./cover.png, alt: "…" }`, top of the page  |
| `draft`       | optional | optional | `true` shows it in `pnpm dev` only, never in build |

- Don't repeat the title as `# Heading` in the body; the page renders it. Start sections at `##`.
- No HTML with classes and no Tailwind in content. If a post needs a visual element (callout,
  diagram), create a component and use it from `.mdx`.
- Available in `.mdx`: `<Callout type="note | warning">` (import it from
  `@/components/Callout.astro`). Leave blank lines inside the tags so the content is Markdown.
- Links to other sites in components use `ExternalLink` (opens a new tab). `mailto:` links don't.

### CV data (`src/data/`)

- Each file exports an `interface` next to the data so content is type-checked.
- Edit text here, never in markup.

## Conventions

### TypeScript

- Everything is TypeScript (strict). No `.js`/`.mjs` files. No `any`.
- Every component declares `interface Props`. Prefer required props over defaults that hide mistakes.
- Import with the `@/` alias (`import BaseLayout from "@/layouts/BaseLayout.astro"`), never `../../`.
  Exception: sibling files in the same folder.

### Styling (Tailwind)

- Tailwind CSS via its Vite plugin; prose (Markdown bodies) styled with `@tailwindcss/typography`.
- Design tokens (colors, fonts) are defined once in `src/styles/global.css` with `@theme`. Use
  token-based classes (`bg-background`, `text-accent`), not raw values (`bg-[#0a192f]`).
- Tailwind classes live only in components, layouts and pages, never in `src/content/` or
  `src/data/`.
- Markdown bodies are styled in one place: the `prose prose-albaicin` wrapper in `ProseLayout`
  (colors mapped to tokens by the `prose-albaicin` utility in `global.css`).
- Code blocks use Shiki's `github-light` theme (`astro.config.ts`).
- No custom CSS files besides `global.css` unless Tailwind truly can't express something.

### Markup and accessibility

- Components are PascalCase (`ArticleCard.astro`); TS modules are lowercase (`articles.ts`).
- Semantic HTML: landmarks (`header`, `nav`, `main`, `footer`), one `<h1>` per page, `aria-label`
  on navs/lists that need a name, `alt` on every image, `<time datetime>` for dates.
- Use Astro's `<Image />` from `astro:assets` for images in `src/`, not raw `<img>`.
- No client-side JavaScript unless a feature truly needs it. If it does, use a small `<script>` in
  the component. No UI framework (React, Vue, …).

### Formatting

- Prettier (`.prettierrc.json`): tabs, double quotes, print width 100. Run `pnpm format`.
- Comments explain _why_, or document a non-obvious contract. Keep them short.

### Git

- Conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`, `content:` (new
  or edited articles, projects or CV data). Example: `feat(home): add experience section`.
- Commit directly to `main`: this is a single-person project. Don't create branches unless the
  owner explicitly asks for one.
- `pnpm check` must pass before committing.

## Common tasks

- **Write an article:** create `src/content/articles/<slug>/index.md` with the frontmatter above.
- **Write up a project:** create `src/content/projects/<slug>/index.md`; add `featured: true` to show
  it on the home page.
- **Edit CV content:** the matching file in `src/data/`. Replace `public/cv.pdf` for the PDF.
- **Change the look:** tokens in `src/styles/global.css`, or classes in the relevant component.
- **Add a page:** a file in `src/pages/` and, if it should be reachable, a link in the relevant nav.

## Out of scope (for now)

Don't build these unless explicitly asked. They can be added later without changing the
architecture:

- Translations / i18n (the site is English only; visitors can use the browser's translator).
- Article series, project dev-logs (multi-page projects), tag pages.
- Highlighting the active section in the home nav while scrolling.
- RSS, sitemap, search, comments, analytics, dark-mode toggle.

## Documentation

Full documentation: https://docs.astro.build · https://tailwindcss.com/docs

Consult these guides before working on related tasks:

- [Adding pages and dynamic routes](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Images](https://docs.astro.build/en/guides/images/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)

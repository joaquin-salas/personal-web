# joaquinsalas.dev

Personal portfolio and blog of Joaquín Salas. Static Astro site, bilingual (English/Spanish),
written in TypeScript, self-hosted on an Oracle Cloud instance behind a reverse proxy.
There is no backend and no database: everything is built to static HTML in `dist/`.

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

## Project structure

```
src/
├── pages/            Routing only. Thin wrappers that render a view. One file per URL, per locale.
│   ├── index.astro               → /
│   ├── blog/index.astro          → /blog/
│   ├── blog/[...slug].astro      → /blog/<slug>/
│   └── es/…                      → same routes under /es/
├── views/            Full page templates, shared by all locales (HomePage, BlogIndexPage, …).
├── layouts/          HTML shell: <head>, SEO/hreflang tags, header, <main>. (BaseLayout)
├── components/       Reusable UI pieces with typed Props (Section, TagList, Navigation, …).
├── content/          Long-form Markdown/MDX content (content collections).
│   └── blog/<slug>/<locale>.md   One folder per post; images live next to the .md files.
├── content.config.ts Collection schemas (frontmatter is validated at build time).
├── data/             Structured CV data as typed TS: profile, experience, education, projects.
├── i18n/             Locales, UI strings and locale/path/date helpers.
│   ├── locales.ts                Supported locales, default locale, `Translated<T>` type.
│   ├── ui.ts                     Every UI string (labels, headings, buttons) in every language.
│   └── utils.ts                  localizePath, getLocale, formatDate, formatYearMonth, …
└── lib/              Domain logic with no markup (e.g. blog.ts: querying posts, slugs, URLs).
public/               Copied as-is to the site root (favicon, cv.pdf, robots.txt). Not optimized.
```

### Where does new code go?

- A new URL → a view in `src/views/` + one thin wrapper per locale in `src/pages/`.
- Markup used in more than one place, or a self-contained block → `src/components/`.
- Logic without markup (queries, transformations) → `src/lib/` (domain) or `src/i18n/` (locale-related).
- CV-style structured data → `src/data/`. Articles or anything with a long body → `src/content/`.
- Images used by a post → inside that post's folder. Images used by components → `src/assets/`.
  Files that must keep an exact URL (cv.pdf, favicon, robots.txt) → `public/`.

## Conventions

### TypeScript

- Everything is TypeScript (strict). No `.js`/`.mjs` files. No `any`.
- Every component declares `interface Props`, even if empty-ish. Prefer required props over defaults
  that hide mistakes.
- Import with the `@/` alias (`import BaseLayout from "@/layouts/BaseLayout.astro"`), never `../../`.
  Exception: sibling files in the same folder (`./locales`).
- Data files export an `interface` next to the data so content is type-checked.

### i18n (most important rule)

Locales: `en` (default, no URL prefix) and `es` (under `/es/`). Defined in `src/i18n/locales.ts`.

- **Never hardcode user-visible text in markup.** Every string comes from one of:
  - `src/i18n/ui.ts` for UI strings → `const t = useTranslations(locale); t("home.about")`
  - `src/data/*.ts` for CV content → `Translated` fields, read as `field[locale]`
  - `src/content/` for articles
- Adding a UI string: add the key to `en` **and** `es` in `ui.ts` (the type forces both).
  Keys are namespaced by area: `nav.*`, `home.*`, `blog.*`, …
- Get the current locale with `getLocale(Astro.currentLocale)` in views/layouts; pass `locale` as a
  prop to components that need it.
- Internal links always go through `localizePath("/path/", locale)`. Never write `/es/...` by hand.
- Dates: `formatDate(date, locale)` / `formatYearMonth("2026-01", locale)`. Never `toLocaleString()` ad hoc.
- Every page exists in every locale. Adding a page means adding a wrapper under `src/pages/` and
  `src/pages/es/`.
- Blog posts may exist in only one language; the language picker falls back to that locale's blog
  index, and hreflang only lists real translations.

### Content (blog)

- Path: `src/content/blog/<slug>/<locale>.md` (or `.mdx`). The folder name is the URL:
  `src/content/blog/my-post/es.md` → `/es/blog/my-post/`.
- Slugs are lowercase kebab-case, in English, and never change once published (they are URLs).
  A translation uses the same folder.
- Frontmatter is validated by `src/content.config.ts`. Required: `title`, `description`, `pubDate`.
  Optional: `updatedDate`, `cover` (`{ src: ./cover.png, alt: "…" }`), `tags`, `draft`.
- `draft: true` shows the post in `pnpm dev` only.
- Don't repeat the title as `# Heading` in the body; the template renders it. Start body sections at `##`.

### Components and styling

- Components are PascalCase (`TagList.astro`); TS modules are lowercase (`blog.ts`, `utils.ts`).
- Use semantic HTML and accessible markup: landmarks (`header`, `nav`, `main`), one `<h1>` per page,
  `aria-label` on lists/navs that need a name, `alt` on every image, `<time datetime>` for dates.
- Use Astro's `<Image />` from `astro:assets` for images in `src/`, not raw `<img>`.
- Styling approach: not decided yet (pending). Until then, don't add styles.
- No client-side JavaScript unless a feature truly needs it. If it does, prefer a small `<script>` in
  the component; add a UI framework integration only when an interactive island justifies it.

### Formatting

- Prettier (`.prettierrc.json`): tabs, double quotes, print width 100. Run `pnpm format`.
- Comments explain _why_, or document a non-obvious contract. Keep them short.

### Git

- Conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`, `content:` (new
  or edited posts/data). Example: `feat(i18n): add language picker`.
- Work on short-lived branches (`feat/...`, `fix/...`, `content/...`) and merge into `main`.
- `pnpm check` must pass before committing.

## Common tasks

- **Write a post:** create `src/content/blog/<slug>/en.md` (and/or `es.md`) with the frontmatter above.
- **Edit CV content:** the matching file in `src/data/` (`profile`, `experience`, `education`, `projects`).
- **Add a UI string:** `src/i18n/ui.ts`, both languages.
- **Add a page:** view in `src/views/`, wrappers in `src/pages/` and `src/pages/es/`, nav link in
  `src/components/Navigation.astro` + its label in `ui.ts`.
- **Add a language:** add it to `locales` in `src/i18n/locales.ts`, fill every `Translated` value
  and `ui.ts` (type errors will list them), add `src/pages/<locale>/` wrappers.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

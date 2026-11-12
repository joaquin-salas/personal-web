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

| Command                     | What it does                                                    |
| --------------------------- | --------------------------------------------------------------- |
| `pnpm dev`                  | Dev server at http://localhost:4321 (drafts visible)            |
| `pnpm check`                | Type-check (`astro check`) + formatting check (Prettier)        |
| `pnpm format`               | Format every file with Prettier                                 |
| `pnpm build`                | Type-check, then build the static site into `dist/`             |
| `pnpm preview`              | Serve `dist/` locally to test the production build              |
| `docker compose up --build` | Build and run the production container at http://localhost:8080 |

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
- **Logic**: plain TypeScript functions such as `getArticles()` or `getFilesystem()`. No markup.
- **Presentation**: Astro pages, layouts and components. They ask `src/lib/` for data and render it.

## Site map

| URL                 | Page                                                   |
| ------------------- | ------------------------------------------------------ |
| `/`                 | Home: the terminal boots and runs neofetch (see below) |
| `/articles/`        | All articles, newest first                             |
| `/articles/<slug>/` | One article                                            |
| `/projects/`        | All projects                                           |
| `/projects/<slug>/` | One project write-up (a single page, like an article)  |
| `/cv.pdf`           | Downloadable CV (static file in `public/`)             |

### The terminal

Every page is the same terminal (`TerminalLayout`): the whole window is the screen. The session
output scrolls in a centred column; `Shell` keeps the suggested commands, the prompt and the
`StatusBar` line (the main navigation: `~ projects articles`) fixed at the bottom. Each page is a
session that has already run its command, rendered at build time:

| Page                | Session                                | Output component      |
| ------------------- | -------------------------------------- | --------------------- |
| `/`                 | `neofetch` (boot animation, see below) | `Neofetch`            |
| `/projects/`        | `cd projects`, `ls`                    | `Listing`             |
| `/articles/`        | `cd articles`, `ls`                    | `Listing`             |
| `/<folder>/<slug>/` | `cat <slug>.md`, in `ProseLayout`      | `Bat` + rendered body |

**The prompt works.** Commands (`src/lib/terminal/commands.ts`): `help`, `neofetch`, `ls` (always
the long view), `tree`, `cd`, `pwd`, `cat` (CV documents print in the terminal; articles and
projects open their page), `open` (also `github`, `linkedin`, `email`), `whoami`, `clear`,
`history`, `echo`, and easter eggs (`sudo`, `rm`, `vim`, `nano`, `theme`, `pacman`, `exit`,
`reboot`, `shutdown now`). Tab completes, ↑/↓ browse history, Ctrl+C cancels, Ctrl+L clears. Every path in the
output has `data-cmd`: clicking it types the command into the prompt, then runs it. Folders and
pages are real `<a href>` links too, so they work without JavaScript.

**One renderer.** Output that never changes (neofetch, `ls` and `tree` of every folder, the CV
documents in `CvDocument`, `help`) is rendered by Astro into `<template>`s in `Shell`; the browser
clones them. Only short dynamic lines (errors, `pwd`, `history`…) are built in the script. The
filesystem (`getFilesystem()`) is sent to the browser as JSON for `cd`, `cat` and completion; the
path logic in `src/lib/terminal/fs.ts` is shared by the build and the browser, so it must not
import from Astro. The working directory and history live in `sessionStorage`.

**Boot.** When a visitor arrives at the home page (from another site, a typed address, a bookmark
or a reload; not when moving around the site or going back), an inline head script sets `data-boot` on
`<html>`; CSS does the rest: the screen powers on, `neofetch` types itself, and each output line
(`.ln`) writes itself in using its `--n`/`--d`/`--t` timing (set at build time in `Neofetch`). Any
key or click skips it; `prefers-reduced-motion` never plays it. Output of later commands writes
itself in quickly (`.fresh`).

**Power.** `PowerButton` is pinned to the top-right corner of every page: a TUI key with a status
light (green while on). Pressing it types `shutdown now`; `shutdown now` and `exit` turn the screen
off (picture to line to dot) and it stays dark with only the key lit (red light) and a hint, until
the key or any other key is pressed, which boots the home page. `reboot` turns it off and boots
again straight away. The `off:` variant styles the off state.

Articles and projects also show `TableOfContents` (`##`/`###` headings, at least two) as a rail of
lines on the right of the screen on wide windows (the layout's `overlay` slot).

### Design direction (a 70s terminal you can use, with modern icons)

The full creative brief is `design/BRIEF.md`; check it before any visual change. In short: the
window is a 70s terminal screen (white phosphor on black, faint glow and scanlines, thick blinking
block cursor) running a modern TUI: one warm accent, rounded panels with titles in the border (like
Claude Code), `lsd` icons, `cat` with a `bat`-style frame, `neofetch`. Nothing requires typing.

- Logo: the JS monogram as block-character art in `Neofetch` (generated by
  `node design/logo/ascii.ts` from `design/logo/mark.mjs`). The SVG files in `design/logo/` are
  the favicons (`USAGE.md`).
- Palette (tokens in `global.css`, dark only): `background`, `ink` (text), `muted` (dates,
  descriptions, tree lines, status line), `rule` (panel borders, dividers, the `cat` frame), `code`
  (code blocks), `accent` almagra (prompt `$`, logo, panel titles, headings, focus), and ANSI colors
  with one role each: `green` (user@host), `yellow` (Markdown file icons, star, warnings), `blue`
  (directories, notes), `cyan` (links), `magenta` (spare). New colors must pass WCAG AA.
- Panels: `<Panel title="…">` for boxed groups (neofetch). Use them for real groups, not for every
  block of output.
- Glass: `crt` (text glow) on the screen and `glass` (scanlines, vignette) over it. Keep them faint.
- Type: Hack Nerd Font Mono (`font-mono`) for everything, 16px (15px on phones; the prompt input is
  always 16px so phones do not zoom). Shipped as subsets built by `node design/fonts/build.ts`:
  text plus only the icons in `src/lib/icons.ts`. After adding an icon there, rebuild the fonts.
- Icons: `<Icon name="…" />` (Nerd Font glyphs, `aria-hidden`); the text next to it carries the
  meaning. No emoji.
- Width: terminal output `max-w-terminal` (100ch), reading text `max-w-reading` (82ch).
- Markdown is rendered, not raw (`prose prose-terminal`): the first `h1` is a block in the accent
  color, `h2` bold accent, bullets drawn inside the item (lines that write themselves in clip
  anything outside their box).
- Code: Shiki's `css-variables` theme, colored by the `--astro-code-*` tokens in `global.css`.
  Blocks show their language as a small label; no copy button.
- Lists, not boxes: tech stacks and tags are plain comma-separated text (`TagList`), not chips.
- Motion: only the boot, the quick write-in of new output, the blinking cursor and the
  `TableOfContents` panel (~150ms). No flicker, no fade-ins elsewhere. All of it is off for
  `prefers-reduced-motion`.
- Copy says what a link does ("View the code"), no `→` suffixes, no `A · B · C` meta strings.

## Project structure

```
src/
├── content/                  Markdown content (content collections). No styling.
│   ├── articles/<slug>/index.md   One folder per article; its images live next to it.
│   └── projects/<slug>/index.md   One folder per project; its images live next to it.
├── content.config.ts         Collection schemas (frontmatter is validated at build time).
├── data/                     CV data as typed TS: profile.ts, experience.ts, education.ts.
├── lib/                      Logic with no markup: articles.ts, projects.ts (queries, sorting,
│                             URLs), filesystem.ts (builds the site's folder tree), icons.ts
│                             (Nerd Font glyphs), dates.ts (date formatting), and terminal/:
│                             fs.ts (paths, `tree` lines, completion) and commands.ts (the
│                             command list), shared by the build and the browser.
├── pages/                    One file per URL. Fetch data from src/lib/ and compose components.
│   ├── index.astro               → /
│   ├── articles/index.astro      → /articles/
│   ├── articles/[slug].astro     → /articles/<slug>/
│   ├── projects/index.astro      → /projects/
│   └── projects/[slug].astro     → /projects/<slug>/
├── layouts/                  BaseLayout      <html lang="en">, <head>, global CSS. Used by every page.
│                             TerminalLayout  The screen: scrolling output, Shell, boot script.
│                             ProseLayout     TerminalLayout + `cat` session, `Bat` frame, `prose` body.
├── components/               Reusable UI with typed Props. Terminal: Shell (prompt, output
│                             templates and the client script), Command (a prompt and its
│                             output), Prompt, StatusBar, PowerButton. Output: Neofetch, Panel, Listing (`ls`),
│                             Tree, Bat (`cat` frame), CvDocument, Help, FsLink (clickable path).
│                             Other: Callout (for .mdx), ExternalLink, Icon, TableOfContents,
│                             TagList.
├── assets/                   Images used by components (optimized by Astro); fonts/ (generated).
└── styles/global.css         Font faces, Tailwind, design tokens (`@theme`), glass, motion, prose.
public/                       Copied as-is to the site root (favicons, cv.pdf, robots.txt).
design/                       Design sources and build scripts, not shipped as files: logo/ (the
                              favicons in `public/` are copied from it; ascii.ts prints the
                              neofetch logo) and fonts/ (build.ts writes src/assets/fonts/).
deploy/                       Server-side files: nginx.conf (the container's web server) and
                              compose.yaml (runs the published image on the server).
Dockerfile                    Production image: builds the site, serves `dist/` with nginx on 8080.
compose.yaml                  Runs that image locally for testing.
.github/workflows/build.yml   On push to main: `pnpm check`, then build the image (arm64 + amd64),
                              push it to ghcr.io/joaquin-salas/personal-web, and deploy it over SSH
                              (a key restricted on the server to pulling and restarting the site).
.claude/agents/               Claude Code subagents: english-reviewer.md (language review of content).
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
| `featured`    | —        | optional | `true` stars the project in `tree` and `ls -l`     |
| `cover`       | optional | optional | `{ src: ./cover.png, alt: "…" }`, top of the page  |
| `draft`       | optional | optional | `true` shows it in `pnpm dev` only, never in build |

- Don't repeat the title as `# Heading` in the body; the page renders it. Start sections at `##`.
- No HTML with classes and no Tailwind in content. If a post needs a visual element (callout,
  diagram), create a component and use it from `.mdx`.
- Available in `.mdx`: `<Callout type="note | warning">` (import it from
  `@/components/Callout.astro`). Leave blank lines inside the tags so the content is Markdown.
- Links to other sites in components use `ExternalLink` (opens a new tab). `mailto:` links don't.

### Writing

- The owner writes all content (articles, projects, CV text) by hand, in British English. Don't
  write or edit prose in `src/content/` or `src/data/` unless explicitly asked.
- To check the English of a file, use the `english-reviewer` subagent
  (`.claude/agents/english-reviewer.md`). It is read-only and reports problems; the owner fixes them.

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
- Markdown bodies are styled in one place: the `prose prose-terminal` wrapper (`ProseLayout`, `CvDocument`)
  (colors, sizes and code mapped to tokens by the `.prose-terminal` rules in `global.css`).
- Code blocks use Shiki's `css-variables` theme (`astro.config.ts`), colored from `global.css`.
- No custom CSS files besides `global.css` unless Tailwind truly can't express something.

### Markup and accessibility

- Components are PascalCase (`StatusBar.astro`); TS modules are lowercase (`articles.ts`).
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
- Work on the `dev` branch: commit and push there. `main` is what gets published (every push to
  `main` builds and pushes the production image), so it only changes by merging `dev` into it.
  Don't create other branches unless the owner explicitly asks for one.
- Merge to `main` only when the owner asks, as a fast-forward:
  `git switch main && git merge --ff-only dev && git push origin main && git switch dev`.
- Don't commit or push on your own. Leave changes uncommitted so the owner can review them, and
  commit (or push) only when asked.
- `pnpm check` must pass before committing.

## Common tasks

- **Write an article:** create `src/content/articles/<slug>/index.md` with the frontmatter above.
- **Write up a project:** create `src/content/projects/<slug>/index.md`; add `featured: true` to star
  it in listings.
- **Edit CV content:** the matching file in `src/data/`. Replace `public/cv.pdf` for the PDF.
- **Change the look:** tokens in `src/styles/global.css`, or classes in the relevant component.
- **Add a page:** a file in `src/pages/` and, if it should be reachable, a link in the relevant nav.

## Out of scope (for now)

Don't build these unless explicitly asked. They can be added later without changing the
architecture:

- Translations / i18n (the site is English only; visitors can use the browser's translator).
- Article series, project dev-logs (multi-page projects), tag pages.
- Highlighting the active section in the home nav while scrolling.
- RSS, sitemap, search, comments, analytics.

## Documentation

Full documentation: https://docs.astro.build · https://tailwindcss.com/docs

Consult these guides before working on related tasks:

- [Adding pages and dynamic routes](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Images](https://docs.astro.build/en/guides/images/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)

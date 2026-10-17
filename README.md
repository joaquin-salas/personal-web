# joaquinsalas.dev

My personal portfolio and blog, built with [Astro](https://astro.build) and TypeScript, in English and Spanish.

## Getting started

```sh
pnpm install
pnpm dev      # http://localhost:4321
```

Before committing: `pnpm check` (types + formatting). `pnpm format` fixes formatting.

## Where to change things

| I want to…                        | Edit                                           |
| --------------------------------- | ---------------------------------------------- |
| Write a blog post                 | `src/content/blog/<slug>/en.md` and/or `es.md` |
| Change my name, tagline, links    | `src/data/profile.ts`                          |
| Add or edit a job                 | `src/data/experience.ts`                       |
| Add or edit a degree              | `src/data/education.ts`                        |
| Add or edit a project             | `src/data/projects.ts`                         |
| Change a label, heading or button | `src/i18n/ui.ts` (both languages)              |
| Add a file with a fixed URL (CV)  | `public/` (e.g. `public/cv.pdf` → `/cv.pdf`)   |

### Writing a post

Each post is a folder; the folder name is the URL. Put images for the post in the same folder.

```
src/content/blog/my-first-project/
├── en.md      → /blog/my-first-project/
├── es.md      → /es/blog/my-first-project/   (optional translation)
└── cover.png
```

```md
---
title: "My first project"
description: "One sentence shown in lists and search results."
pubDate: 2026-10-17
tags: ["astro", "typescript"]
cover:
  src: ./cover.png
  alt: "Describe the image"
draft: true # remove when ready to publish
---

Start with text or a `##` heading — the title is rendered for you.
```

The build fails with a clear message if a required field is missing or has the wrong type.

## Architecture

See [AGENTS.md](./AGENTS.md) for the full project structure and conventions.

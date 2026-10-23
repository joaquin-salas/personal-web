# joaquinsalas.dev

My personal portfolio: CV, technical articles and project write-ups. Built with
[Astro](https://astro.build) and TypeScript.

## Getting started

```sh
pnpm install
pnpm dev      # http://localhost:4321
```

Before committing: `pnpm check` (types + formatting). `pnpm format` fixes formatting.

## Where to change things

| I want to…                       | Edit                                         |
| -------------------------------- | -------------------------------------------- |
| Write an article                 | `src/content/articles/<slug>/index.md`       |
| Write up a project               | `src/content/projects/<slug>/index.md`       |
| Change my name, tagline, links   | `src/data/profile.ts`                        |
| Add or edit a job                | `src/data/experience.ts`                     |
| Add or edit a degree             | `src/data/education.ts`                      |
| Add a file with a fixed URL (CV) | `public/` (e.g. `public/cv.pdf` → `/cv.pdf`) |
| Change colors or fonts           | `src/styles/global.css` (the `@theme` block) |

### Writing an article

Each article is a folder; the folder name is the URL. Put images for the article in the same folder.

```
src/content/articles/kafka-consumer-groups/
├── index.md   → /articles/kafka-consumer-groups/
└── cover.png
```

```md
---
title: "How Kafka consumer groups work"
description: "One sentence shown in lists and search results."
pubDate: 2026-10-17
tags: ["kafka", "distributed-systems"]
cover:
  src: ./cover.png
  alt: "Describe the image"
draft: true # remove when ready to publish
---

Start with text or a `##` heading — the title is rendered for you.
```

### Writing up a project

Same idea, in `src/content/projects/<slug>/index.md` → `/projects/<slug>/`:

```md
---
title: "Wazuh home lab"
description: "One sentence shown in lists and search results."
pubDate: 2026-10-17
stack: ["Wazuh", "Docker", "Linux"]
repo: "https://github.com/…" # optional
demo: "https://…" # optional
featured: true # show it on the home page
---
```

The build fails with a clear message if a required field is missing or has the wrong type. See
[AGENTS.md](./AGENTS.md) for every field.

### Using components in a post (MDX)

Name the file `index.mdx` instead of `index.md`, import the component below the frontmatter and
use it like an HTML tag:

```mdx
import Callout from "@/components/Callout.astro";

<Callout type="warning">

The agent and the server must run **compatible versions**.

</Callout>
```

`type` is `note` (blue) or `warning` (red). Keep the blank lines around the text so it is read as
Markdown.

## Architecture

See [AGENTS.md](./AGENTS.md) for the full project structure and conventions.

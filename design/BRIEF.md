# joaquinsalas.dev brief

Creative direction for the site's colour, typography and brand. Every design change checks against
this file. Update it when the direction really changes, not when execution gets hard.

## Project

**Name:** joaquinsalas.dev

**Description:** Personal site of Joaquín Salas, a Computer Engineering graduate and software
engineer in Granada. A CV-style home page, write-ups of projects he has built, and technical
articles about what he is learning (Kubernetes, Kafka, Raft...). Static, self-hosted, English only.

**Target audience:** Tech recruiters and engineering managers hiring for a first full-time role.
Engineers who arrive from an article are the secondary audience.

**Business goal:** In about 30 seconds a hiring reader concludes "serious, thoughtful engineer who
explains things clearly", and finds proof in the projects and articles. Success is interviews.

## The four axes

### Tone register: Conversational

First person and warm, like a thoughtful person talking. It makes a junior profile read as genuine
instead of inflated.

### Aesthetic philosophy: Editorial restrained, reading-first

Clean and minimal, with generous space, few colours and strong typography. The pages exist to be
read, so legibility beats decoration every time.

### Audience relationship: Peer

"I'm figuring this out and sharing it." This matches articles about things he is learning, without
overclaiming expertise.

### Sensory ambition: Considered

Readers notice the care in the type pairing, spacing and small details like the monogram, but the
craft never gets between them and the text.

## Synthesis

This brief produces quiet, text-first pages that look like a well-set book more than an app. A
warm off-white page, near-black ink and one accent colour carry everything. A refined serif sets
long-form text; a clean sans handles names, headings and interface. The oversized name on the home
page is the one bold gesture and the JS monogram is the signature. Granada survives only as an
undertone in the warmth of the paper and ink, never as a theme.

Each detail has a reason: comfortable line length, a clear type scale, visible focus, honest link
styling. Nothing moves, glows or decorates. A recruiter skimming sees order and taste; an engineer
reading an article never notices the design, only that it is easy to read.

## Inspiration references

- **brittanychiang.com**: layout. The sticky left column with name and nav, and the scrolling right
  column with the CV. Calibrates structure, not visual style.
- **leerob.com**: how far minimal can go. Text-first, almost no decoration. Calibrates aesthetic
  philosophy.
- **paco.me / rauno.me**: quiet, precise typography and tiny considered details. Calibrates
  sensory ambition.

## Rejection list

This brief explicitly says no to:

- The template dev-portfolio look: dark navy with a neon accent, gradient blobs, glassmorphism,
  "Hi, I'm X 👋".
- Chips, bordered cards, badges, tech-stack pills and skill bars. Lists are rows; stacks are plain
  text.
- Decorative motion: fade-ins, parallax, hover-lift, scroll effects.
- Stock photos, stock illustrations and emoji as decoration.
- More than one accent colour in the interface.
- Granada as a visible theme (tile patterns, ornament). It stays an undertone.

## Decisions already made

- **Logo:** the JS monogram (`design/logo/`), always one colour, following `design/logo/USAGE.md`.
- **Big name:** kept as the one bold element, refined to fit the new type system.
- **Type direction:** serif for reading, sans for headings and UI, mono for code only.
- **Palette: "Almagra"** (chosen 2026-10-25). Warm paper `#f7f4ee`, warm black ink `#1d1b18`,
  muted `#655f57`, rule `#e7e1d6`, one accent: almagra clay red `#9e3b26` (links, focus). Contrast
  on paper: ink 15.7, muted 5.8, accent 6.2. Ochre is retired; draft labels use muted.
- **Typefaces** (chosen 2026-10-25): Bricolage Grotesque for the name, headings and UI (condensed
  width for the big name); Literata for body and article text; JetBrains Mono for code.
- **Reading layout** (chosen 2026-10-25): article text Literata 18px, line height 1.7. Single-column
  pages are 48rem wide (about 92 characters per line), and the top bar, title and body share that
  one column so they line up. The width is one token, so it is easy to change; if long lines get
  tiring, try line height 1.75 before narrowing.
- **Code** (chosen 2026-10-25): "Warm Almagra" syntax colours via Shiki's `css-variables` theme, so
  they are tokens in `global.css` (and get dark values later). Blocks sit on a slightly darker
  paper (`#efe9df`) with no border; keywords and numbers almagra `#9e3b26`, strings olive
  `#5f5a1f`, types slate `#3d5566`, comments muted italic `#6e665c`, the rest ink (all ≥ 4.5:1 on
  the block). Inline code uses the same background, no backticks. Each block shows a small
  language label from Astro's `data-language` attribute (CSS only). No copy button (needs JS).
- **Theme:** light only for now. Dark mode comes later as automatic (follows the OS) plus a toggle,
  so the palette must be defined as tokens that can be swapped.

## Open questions

- Dark-mode values for the Almagra palette (later).

# joaquinsalas.dev brief

Creative direction for the site's colour, typography and brand. Every design change checks against
this file. Update it when the direction really changes, not when execution gets hard.

The previous direction ("Almagra": warm paper, serif reading pages, a well-set book) was replaced
on 2026-11-12. It lives in this file's git history.

## Project

**Name:** joaquinsalas.dev

**Description:** Personal site of Joaquín Salas, a Computer Engineering graduate and software
engineer in Granada. A CV, write-ups of projects he has built, and technical articles about what he
is learning (Kubernetes, Kafka, Raft...). Static, self-hosted, English only.

**Target audience:** Tech recruiters and engineering managers hiring for a first full-time role.
Engineers who arrive from an article are the secondary audience.

**Business goal:** In about 30 seconds a hiring reader concludes "serious, thoughtful engineer who
explains things clearly", and finds proof in the projects and articles. Success is interviews.

## The four axes

### Tone register: Conversational, with a terminal accent

First person and warm. The terminal supplies the voice of the interface (prompts, command output,
the odd joke from `sudo`), but the CV and articles still read like a person talking.

### Aesthetic philosophy: A 70s terminal you can use, with modern icons

The whole window is the screen of a 70s terminal: white phosphor text on black, a thick blinking
block cursor, a soft glow and faint scanlines. On it runs the modern CLI layer Joaquín actually
uses: `lsd`-style icons and colours, `cat` with a `bat`-style frame around rendered Markdown,
`neofetch` for the introduction, and rounded TUI panels with titles set into the border (like
Claude Code or OpenCode). Mostly black and white; colour is an accent, not a theme. The icons are
not decoration: they tell folders from files and articles from projects at a glance.

### Audience relationship: Peer

"This is how I use my computer; come in." It shows taste and real familiarity with Linux instead of
claiming it.

### Sensory ambition: Playful, but legible

The first visit is a small show: the screen powers on, `neofetch` types itself and its output writes
itself in. After that everything is calm and readable, and the prompt really works.

## Synthesis

On the first visit of a session the screen powers on (a line of light opening into the picture),
`neofetch` types itself at the prompt and the logo and panels write themselves in, in about two and
a half seconds. Any key or click skips it; reduced motion never sees it. Then the prompt, fixed at
the bottom of the screen, is ready: `help`, `ls`, `tree`, `cd`, `cat`, `open` and a few hidden ones.
Nothing requires typing: every path in the output is clickable and types its command into the prompt
before running it, a row of suggestions sits above the prompt, and the status line under it is the
ordinary navigation. Articles and projects are real pages that open as `cat file.md`.

## Inspiration references

- **A 70s terminal** (Fallout's terminals): the glow, the block cursor, the power-on. Calibrates the
  mood, not realism.
- **Claude Code, OpenCode**: TUI panels with rounded borders and titles, a prompt box at the bottom,
  a quiet footer line, one warm accent. Calibrates the interface.
- **lsd, bat, neofetch, tree**: how listings, files and the introduction are drawn. Calibrates the
  detail layer.

## Rejection list

This brief explicitly says no to:

- A terminal you must type into. Every command's result must also be reachable by clicking.
- A fake terminal in front of a normal site: the terminal _is_ the site, and real URLs still exist
  for every page, rendered at build time.
- A realistic emulator: photographic textures, screen curvature, reflections, heavy bloom.
- CRT effects that hurt reading: flicker, strong scanlines, chromatic aberration, green or amber
  monochrome.
- Animations that make people wait: the boot plays only when someone arrives at the site, is skippable, and output from
  later commands writes itself in a fraction of a second.
- Recreating a specific product's look (a particular distro's branding or a named theme as-is).
- The template dev-portfolio look: navy with neon, gradients, glassmorphism, "Hi, I'm X 👋".
- Emoji as icons. Icons are Nerd Font glyphs, like `lsd`.

## Decisions already made

- **Logo:** the JS monogram (`design/logo/`). On the screen it appears as block art in the
  `neofetch` output (`node design/logo/ascii.ts`); the SVG is the favicon.
- **Typeface** (chosen 2026-11-12): Hack Nerd Font Mono for everything, text and icons, shipped as
  subsets with only the glyphs used (`node design/fonts/build.ts`, about 47 KB per style).
- **Screen** (chosen 2026-11-12, from the JS-77 prototype): the window is the screen. Output scrolls
  in a centred column of 100 characters; suggestions, the prompt box and the status line are fixed
  at the bottom.
- **Glass:** a faint text glow, scanlines at 18% black every 3px, and a vignette.
- **Boot:** power-on 850ms, `neofetch` typed from 950ms, output written line by line from 1450ms,
  prompt ready at about 2.5s. Plays when a visitor arrives (not when moving around the site); skippable; off for reduced motion.
- **Power key** (chosen 2026-11-12): top-right on every page, a key in the prompt box style with a
  status light, green while on. It turns the screen off and leaves it dark with only the key lit
  (red light, accent glow) until it or any key is pressed, which boots the home page.
- **Commands:** `ls` is always the long view; `cat` reads files as rendered Markdown in a `bat`-style
  frame (there is no `bat` command); articles and projects open as their own pages.
- **Palette** (chosen 2026-11-12, all pass WCAG AA on the screen):

  | Role       | Colour    | Contrast | Used for                                              |
  | ---------- | --------- | -------- | ----------------------------------------------------- |
  | background | `#0b0b0a` | —        | Screen                                                |
  | ink        | `#ebe9e4` | 16.2     | Text: white phosphor                                  |
  | muted      | `#8e8b85` | 5.8      | Dates, descriptions, tree lines, gutters, status line |
  | rule       | `#3a3835` | —        | Panel borders, dividers, the `cat` frame              |
  | accent     | `#e0826a` | 7.1      | Almagra: prompt `$`, logo, panel titles, headings     |
  | green      | `#9fbf6a` | 9.5      | `joaquin@salas` in the prompt                         |
  | yellow     | `#d9b25c` | 9.8      | Markdown file icons, featured star, warnings          |
  | blue       | `#7fa6d4` | 7.8      | Directories, notes                                    |
  | cyan       | `#79bfb5` | 9.3      | Links                                                 |

  The accent keeps the old Almagra red, so Granada survives as an undertone.

- **Dark only, for now.** A `theme` command with alternative palettes comes later.

## Open questions

- The CV documents (`about.md`, `experience.md`, `education.md`) only exist inside the terminal, so
  search engines see the neofetch summary but not their full text.

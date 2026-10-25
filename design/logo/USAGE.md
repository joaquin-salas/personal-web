# JS mark: usage guide

The personal monogram of Joaquin Salas. One continuous fineliner line where the J loops into the S, with woven over/under gaps at the two crossings.

## 1. Which version at which size

| Size | File | Why |
|---|---|---|
| 48 px and larger | `js-mark.svg` (regular) | The fine line is the mark's character |
| Below 48 px | `js-mark-small.svg` (small) | Thicker line so it survives small sizes |
| Never below 16 px | — | Below the favicon size it stops reading as JS |

## 2. Clear space

Keep empty space on every side of the mark of at least **¼ of the mark's width**. Nothing goes inside that zone: no text, edges or other graphics.

The avatar and app icon PNGs already include this space, so circle crops never cut the line.

## 3. Colors

| Background | Mark | Background color |
|---|---|---|
| Light | `#111111` | `#FAFAF8` |
| Dark | `#F2F2EE` | `#0E0E0E` |

Always one color. `js-mark.svg` uses `currentColor`, so on the website it takes the surrounding text color and follows light/dark mode automatically.

## 4. Don't

- Don't stretch, squash or rotate it.
- Don't add shadows, outlines, gradients or ink/texture effects.
- Don't fill the gaps at the crossings. They are the over/under weave that makes the mark.
- Don't redraw it or trace it from a screenshot. Always use the original files.

## 5. Which file goes where

| Where | File |
|---|---|
| Website (logo, header) | `js-mark.svg`, `js-mark-small.svg` |
| Browser tab | `favicon.svg` + `favicon.ico` |
| Phone home screen / web app | `png/apple-touch-icon.png`, `png/icon-192.png`, `png/icon-512.png` |
| GitHub, LinkedIn, X and other profiles | `png/avatar-light.png` or `png/avatar-dark.png` |
| Anything else needing a fixed color | `js-mark-black.svg`, `js-mark-white.svg`, `png/mark-black-1024.png`, `png/mark-white-1024.png` |

## Rebuilding

All files are generated from one geometry definition. To regenerate them (requires Node and Google Chrome):

```
node design/logo/build.mjs
```

Backups of the alternative directions are in `design/logo-variants/backup/`.

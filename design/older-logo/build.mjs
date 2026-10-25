// Older monoline version (replaced by the brush mark in design/logo/). Builds every JS mark file from one geometry definition.
// Usage: node design/older-logo/build.mjs
// Needs Google Chrome (for PNG export). No npm dependencies.
import { writeFileSync, readFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const OUT = dirname(fileURLToPath(import.meta.url));
const PNG = join(OUT, "png");
const TMP = join(OUT, ".tmp");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const INK = "#111111";
const PAPER = "#FAFAF8";
const INK_DARK = "#F2F2EE"; // ink on dark backgrounds
const PAPER_DARK = "#0E0E0E";

// Geometry (100x100 box). One continuous fineliner stroke: J loops into S.
// Woven crossings: the loop passes over the J stem, the S spine passes over the rising line.
const G = {
  full: "M42 16 L42 62 C42 78 24 82 20 70 C17 60 32 56 46 54 C58 52 70 42 74 34 C70 26 58 26 55 34 C52 42 74 48 74 60 C73 72 60 78 50 72",
  loop: "M20 70 C17 60 32 56 46 54 C58 52 70 42 74 34",
  s: "M74 34 C70 26 58 26 55 34 C52 42 74 48 74 60 C73 72 60 78 50 72",
  cross1: [42, 55], // loop over stem
  cross2: [64, 46], // S spine over rising line
  offset: "translate(3.5 2)",
};

// Two optical cuts: regular for >= 48px, small for favicons and tiny UI.
const CUTS = {
  regular: { stroke: 3.2, gap: 2.4, clip: 7 },
  small: { stroke: 6.5, gap: 2.4, clip: 9 },
};

function markSvg({ cut = "regular", color = "currentColor", size = 512, bg = null, scale = 1, style = "" }) {
  const c = CUTS[cut];
  const halo = c.stroke + c.gap * 2;
  const [x1, y1] = G.cross1;
  const [x2, y2] = G.cross2;
  // Scale around the centre of the box (for padded avatar/app icons).
  const fit = scale === 1 ? "" : `translate(50 50) scale(${scale}) translate(-50 -50) `;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="JS">
${style ? `  <style>${style}</style>\n` : ""}  <defs>
    <path id="full" d="${G.full}"/>
    <path id="loop" d="${G.loop}"/>
    <path id="s" d="${G.s}"/>
    <clipPath id="c1"><circle cx="${x1}" cy="${y1}" r="${c.clip}"/></clipPath>
    <clipPath id="c2"><circle cx="${x2}" cy="${y2}" r="${c.clip}"/></clipPath>
    <!-- Gap areas are 1 unit smaller than the redrawn strands so their edges overlap (no anti-alias seams). -->
    <clipPath id="g1"><circle cx="${x1}" cy="${y1}" r="${c.clip - 1}"/></clipPath>
    <clipPath id="g2"><circle cx="${x2}" cy="${y2}" r="${c.clip - 1}"/></clipPath>
    <mask id="gaps" maskUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="120">
      <rect x="-10" y="-10" width="120" height="120" fill="#fff"/>
      <g fill="none" stroke="#000" stroke-width="${halo}" stroke-linecap="round">
        <use href="#loop" clip-path="url(#g1)"/>
        <use href="#s" clip-path="url(#g2)"/>
      </g>
    </mask>
  </defs>
${bg ? `  <rect width="100" height="100" fill="${bg}"/>\n` : ""}  <g class="ink" transform="${fit}${G.offset}" fill="none" stroke="${color}" stroke-width="${c.stroke}" stroke-linecap="round" stroke-linejoin="round">
    <use href="#full" mask="url(#gaps)"/>
    <use href="#loop" clip-path="url(#c1)"/>
    <use href="#s" clip-path="url(#c2)"/>
  </g>
</svg>
`;
}

const svgs = {
  // Inline on the website: inherits text color, so it follows light/dark mode automatically.
  "js-mark.svg": markSvg({}),
  "js-mark-small.svg": markSvg({ cut: "small" }),
  "js-mark-black.svg": markSvg({ color: INK }),
  "js-mark-white.svg": markSvg({ color: INK_DARK }),
  // Browser tab icon: switches ink with the OS color scheme.
  "favicon.svg": markSvg({
    cut: "small",
    color: INK,
    size: 32,
    style: `.ink{stroke:${INK}}@media (prefers-color-scheme:dark){.ink{stroke:${INK_DARK}}}`,
  }),
};
for (const [name, body] of Object.entries(svgs)) writeFileSync(join(OUT, name), body);

// PNG exports via headless Chrome.
const pngs = [
  { name: "favicon-16.png", size: 16, cut: "small", color: INK },
  { name: "favicon-32.png", size: 32, cut: "small", color: INK },
  { name: "favicon-48.png", size: 48, cut: "small", color: INK },
  { name: "apple-touch-icon.png", size: 180, cut: "regular", color: INK, bg: PAPER, scale: 0.72 },
  { name: "icon-192.png", size: 192, cut: "regular", color: INK, bg: PAPER, scale: 0.72 },
  { name: "icon-512.png", size: 512, cut: "regular", color: INK, bg: PAPER, scale: 0.72 },
  // Profile pictures (GitHub, LinkedIn, X...). Padded so a circle crop never touches the strokes.
  { name: "avatar-light.png", size: 1024, cut: "regular", color: INK, bg: PAPER, scale: 0.62 },
  { name: "avatar-dark.png", size: 1024, cut: "regular", color: INK_DARK, bg: PAPER_DARK, scale: 0.62 },
  { name: "mark-black-1024.png", size: 1024, cut: "regular", color: INK },
  { name: "mark-white-1024.png", size: 1024, cut: "regular", color: INK_DARK },
];

mkdirSync(PNG, { recursive: true });
mkdirSync(TMP, { recursive: true });
for (const p of pngs) {
  const svgPath = join(TMP, p.name.replace(".png", ".svg"));
  writeFileSync(svgPath, markSvg(p));
  const html = join(TMP, p.name.replace(".png", ".html"));
  writeFileSync(html, `<!doctype html><style>html,body{margin:0;background:transparent}img{display:block}</style><img src="${pathToFileURL(svgPath)}" width="${p.size}" height="${p.size}">`);
  execFileSync(CHROME, [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--default-background-color=00000000",
    `--window-size=${p.size},${p.size}`,
    `--screenshot=${join(PNG, p.name)}`,
    pathToFileURL(html).href,
  ], { stdio: "ignore" });
}

// favicon.ico: PNG-compressed entries for 16, 32, 48.
const icoSizes = [16, 32, 48];
const images = icoSizes.map((s) => readFileSync(join(PNG, `favicon-${s}.png`)));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((img, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(icoSizes[i], e);
  header.writeUInt8(icoSizes[i], e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(img.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += img.length;
});
writeFileSync(join(OUT, "favicon.ico"), Buffer.concat([header, ...images]));

rmSync(TMP, { recursive: true, force: true });
console.log("built:", Object.keys(svgs).join(", "), "| png:", pngs.map((p) => p.name).join(", "), "| favicon.ico");

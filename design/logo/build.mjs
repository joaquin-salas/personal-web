// Builds the brush-pen version of the JS mark (05C geometry, stroke style D).
// The mark itself is drawn in mark.mjs.
// Usage: node design/logo/build.mjs
// Needs Google Chrome (for PNG export). No npm dependencies.
import { writeFileSync, readFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { markSvg } from "./mark.mjs";

const OUT = dirname(fileURLToPath(import.meta.url));
const PNG = join(OUT, "png");
const TMP = join(OUT, ".tmp");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const INK = "#111111";
const PAPER = "#FAFAF8";
const INK_DARK = "#F2F2EE"; // ink on dark backgrounds
const PAPER_DARK = "#0E0E0E";

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
    style: `.ink{fill:${INK}}@media (prefers-color-scheme:dark){.ink{fill:${INK_DARK}}}`,
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

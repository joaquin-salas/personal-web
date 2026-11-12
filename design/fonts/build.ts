// Builds the site's font files: Hack Nerd Font Mono, subset to the text characters the site needs
// plus only the icons listed in src/lib/icons.ts. The full font is several MB per weight; the
// subsets are a few dozen KB.
// Usage: node design/fonts/build.ts (downloads the source fonts, writes src/assets/fonts/*.woff2)
import { readFileSync, writeFileSync } from "node:fs";
import subsetFont from "subset-font";

const VERSION = "v3.4.0"; // Nerd Fonts release
const WEIGHTS = ["Regular", "Bold", "Italic"];
const OUT = new URL("../../src/assets/fonts/", import.meta.url);

/** Inclusive codepoint ranges for text, e.g. box drawing for `tree` and blocks for the logo. */
const TEXT_RANGES: [number, number][] = [
	[0x0020, 0x007e], // ASCII
	[0x00a0, 0x017f], // Latin-1 and Latin Extended-A (accents)
	[0x2010, 0x2027], // Dashes, quotes, bullets, ellipsis
	[0x2030, 0x203a], // Per mille, primes, angle quotes
	[0x20ac, 0x20ac], // Euro
	[0x2122, 0x2122], // Trade mark
	[0x2190, 0x21ff], // Arrows
	[0x2500, 0x257f], // Box drawing
	[0x2580, 0x259f], // Block elements
	[0x25a0, 0x25ff], // Geometric shapes
];

function iconText(): string {
	const source = readFileSync(new URL("../../src/lib/icons.ts", import.meta.url), "utf8");
	const codes = [...source.matchAll(/\\u\{([0-9a-f]+)\}/gi)].map((m) => parseInt(m[1], 16));
	return String.fromCodePoint(...codes);
}

const text =
	TEXT_RANGES.map(([from, to]) =>
		String.fromCodePoint(...Array.from({ length: to - from + 1 }, (_, i) => from + i)),
	).join("") + iconText();

for (const weight of WEIGHTS) {
	const url = `https://github.com/ryanoasis/nerd-fonts/raw/${VERSION}/patched-fonts/Hack/${weight}/HackNerdFontMono-${weight}.ttf`;
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${response.status} downloading ${url}`);
	const subset = await subsetFont(Buffer.from(await response.arrayBuffer()), text, {
		targetFormat: "woff2",
	});
	const file = new URL(`hack-nerd-font-${weight.toLowerCase()}.woff2`, OUT);
	writeFileSync(file, subset);
	console.log(`${file.pathname}: ${(subset.length / 1024).toFixed(1)} KB`);
}

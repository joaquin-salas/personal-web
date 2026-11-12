// The colour themes the `theme` command switches between. Their colours live in global.css (one
// `[data-theme]` block each, redefining the design tokens); this list only names and describes
// them. Shared by the build (the `theme` output, the head script) and the browser.

export interface Theme {
	name: string;
	description: string;
}

export const DEFAULT_THEME = "almagra";

export const THEMES: Theme[] = [
	{ name: "almagra", description: "White phosphor and the almagra red" },
	{ name: "everforest", description: "Soft forest greens on grey-green" },
	{ name: "gruvbox", description: "Warm 90s editor colours on brown-black" },
	{ name: "amber", description: "A monochrome amber phosphor screen" },
	{ name: "hallows-eve", description: "Black and white, pumpkin orange and witch purple" },
	{ name: "house-special", description: "Soft lavender on near-black, mauve accent" },
	{ name: "tokyo-night", description: "A city at night: navy, neon blue and violet" },
	{ name: "greenscreen", description: "Green phosphor, the oldest terminal of all" },
];

export const THEME_NAMES = THEMES.map((theme) => theme.name);

/** Where the visitor's choice is kept (localStorage, so it lasts across visits). */
export const THEME_KEY = "theme";

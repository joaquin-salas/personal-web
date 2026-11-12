// Nerd Font glyphs used on the site, like `lsd` shows them. Each one is a private-use codepoint of
// Hack Nerd Font. design/fonts/build.ts reads this file and keeps only these glyphs in the shipped
// font, so after adding an icon here, run `node design/fonts/build.ts`.
// Codepoints: https://www.nerdfonts.com/cheat-sheet

export const icons = {
	folder: "\u{f07b}",
	folderOpen: "\u{f07c}",
	markdown: "\u{f48a}",
	pdf: "\u{f1c1}",
	home: "\u{f015}",
	star: "\u{f005}",
	user: "\u{f007}",
	location: "\u{f041}",
	work: "\u{f0b1}",
	education: "\u{f19d}",
	code: "\u{f121}",
	terminal: "\u{f120}",
	book: "\u{f02d}",
	calendar: "\u{f073}",
	github: "\u{f09b}",
	linkedin: "\u{f0e1}",
	email: "\u{f0e0}",
	link: "\u{f0c1}",
	external: "\u{f08e}",
	power: "\u{f011}",
} as const;

export type IconName = keyof typeof icons;

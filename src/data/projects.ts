// Featured projects shown on the home page, in display order.
// Edit content here, not in the markup. Text shown to visitors is written once per
// language: `{ en: "...", es: "..." }`. Anything marked TODO is a placeholder.

import type { Translated } from "@/i18n/locales";

export interface Project {
	title: string;
	description: Translated;
	stack: string[];
	repo?: string;
	demo?: string;
}

export const projects: Project[] = [
	{
		title: "joaquinsalas.dev",
		description: {
			en: "This website: a statically generated, bilingual portfolio and blog, self-hosted on an Oracle Cloud instance behind a reverse proxy.",
			es: "Esta web: un portfolio y blog bilingüe generado estáticamente, alojado en una instancia propia de Oracle Cloud detrás de un proxy inverso.",
		},
		stack: ["Astro", "TypeScript"],
		// repo: "https://github.com/TODO/personal-web",
	},
	// TODO: add your final-year project and 1–2 more
];

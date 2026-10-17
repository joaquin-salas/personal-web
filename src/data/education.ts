// Degrees and courses, newest first.
// Edit content here, not in the markup. Text shown to visitors is written once per
// language: `{ en: "...", es: "..." }`. Anything marked TODO is a placeholder.

import type { Translated } from "@/i18n/locales";

export interface Education {
	degree: Translated;
	institution: Translated;
	location: Translated;
	/** `"YYYY"` or `"YYYY-MM"`. */
	start: string;
	end: string;
	details?: Translated;
}

export const education: Education[] = [
	{
		degree: {
			en: "BSc in Computer Engineering",
			es: "Grado en Ingeniería Informática",
		},
		institution: {
			en: "University of Granada (UGR)",
			es: "Universidad de Granada (UGR)",
		},
		location: { en: "Granada, Spain", es: "Granada, España" },
		start: "TODO",
		end: "TODO",
		// details: { en: "Final-year project: TODO", es: "Trabajo Fin de Grado: TODO" },
	},
];

// Work experience, newest first.
// Edit content here, not in the markup. Text shown to visitors is written once per
// language: `{ en: "...", es: "..." }`. Anything marked TODO is a placeholder.

import type { Translated } from "@/i18n/locales";

export interface Experience {
	company: string;
	companyUrl?: string;
	role: Translated;
	/** `"YYYY-MM"`, formatted per language. */
	start: string;
	/** `"YYYY-MM"`, or `"present"`. */
	end: string;
	summary: Translated;
	highlights: Translated<string[]>;
	stack: string[];
}

export const experience: Experience[] = [
	{
		company: "Naranjo",
		role: { en: "Full-Stack Developer (Intern)", es: "Desarrollador full-stack (prácticas)" },
		start: "TODO", // e.g. "2026-01"
		end: "TODO",
		summary: {
			en: "Worked on AITANNA.AI across the frontend and backend.",
			es: "Trabajé en AITANNA.AI tanto en el frontend como en el backend.",
		},
		highlights: {
			en: [
				"Built features for the React frontend and the Node.js/Koa API backed by MongoDB.",
				"Worked in a monorepo with Docker-based environments.",
				"Followed a branch-based Git/GitHub workflow with conventional commits and code review.",
				// TODO: add 1–2 concrete achievements, ideally with numbers
			],
			es: [
				"Desarrollé funcionalidades para el frontend en React y la API en Node.js/Koa con MongoDB.",
				"Trabajé en un monorepo con entornos basados en Docker.",
				"Seguí un flujo de trabajo con ramas en Git/GitHub, conventional commits y revisión de código.",
			],
		},
		stack: ["React", "Node.js", "Koa", "MongoDB", "Docker", "Git", "GitHub"],
	},
];

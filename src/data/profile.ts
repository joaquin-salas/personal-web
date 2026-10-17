// Who you are: name, tagline, about text, contact and social links.
// Edit content here, not in the markup. Text shown to visitors is written once per
// language: `{ en: "...", es: "..." }`. Anything marked TODO is a placeholder.

import type { Translated } from "@/i18n/locales";

export interface Link {
	label: Translated;
	href: string;
}

export const profile = {
	name: "Joaquín Salas",
	role: { en: "Software Engineer", es: "Ingeniero de software" },
	location: { en: "Granada, Spain", es: "Granada, España" },
	tagline: {
		en: "Computer Engineering graduate from the University of Granada. I build full-stack web applications with React, Node.js and TypeScript.",
		es: "Graduado en Ingeniería Informática por la Universidad de Granada. Desarrollo aplicaciones web full-stack con React, Node.js y TypeScript.",
	},
	about: {
		en: [
			"I recently graduated in Computer Engineering (Ingeniería Informática) from the University of Granada.",
			"During a six-month internship at Naranjo I worked across the frontend and backend of AITANNA.AI, inside a monorepo with Docker, branch-based Git workflows and conventional commits.",
			"I'm currently looking for my first full-time role as a software engineer.",
		],
		es: [
			"Me he graduado recientemente en Ingeniería Informática por la Universidad de Granada.",
			"Durante unas prácticas de seis meses en Naranjo trabajé en el frontend y el backend de AITANNA.AI, dentro de un monorepo con Docker, flujos de trabajo con ramas en Git y conventional commits.",
			"Actualmente busco mi primer empleo a tiempo completo como ingeniero de software.",
		],
	},
	email: "TODO@example.com", // TODO
	links: [
		{ label: { en: "GitHub", es: "GitHub" }, href: "https://github.com/TODO" }, // TODO
		{ label: { en: "LinkedIn", es: "LinkedIn" }, href: "https://www.linkedin.com/in/TODO" }, // TODO
		// { label: { en: "CV", es: "CV" }, href: "/cv.pdf" }, // put the PDF in public/cv.pdf
	] satisfies Link[],
} satisfies {
	name: string;
	role: Translated;
	location: Translated;
	tagline: Translated;
	about: Translated<string[]>;
	email: string;
	links: Link[];
};

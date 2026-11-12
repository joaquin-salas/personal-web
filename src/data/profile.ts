// Who you are: name, tagline, about text, contact and social links.
// Edit content here, not in the markup. Anything marked TODO is a placeholder.

export interface Link {
	label: string;
	href: string;
}

export interface Profile {
	name: string;
	role: string;
	location: string;
	tagline: string;
	/** One string per paragraph. */
	about: string[];
	email: string;
	links: Link[];
}

export const profile: Profile = {
	name: "Joaquín Salas",
	role: "Software Engineer",
	location: "Granada, Spain",
	tagline:
		"Computer Engineering graduate from the University of Granada. I build full-stack web applications with React, Node.js and TypeScript.",
	about: [
		"I recently graduated in Computer Engineering from the University of Granada.",
		"During a year at Naranjo Intelligent Solutions I worked across the frontend and backend of AITANNA.AI, inside a monorepo with Docker, branch-based Git workflows and conventional commits.",
		"I'm currently working on side projects like this website and a key value storage implemented with Raft in Go while I'm looking for a full time job.",
	],
	email: "joaquin.salas.dev@gmail.com",
	links: [
		{ label: "GitHub", href: "https://github.com/joaquin-salas" },
		{ label: "LinkedIn", href: "https://www.linkedin.com/in/joaquin-salas-castillo" },
		// { label: "CV", href: "/cv.pdf" }, // put the PDF in public/cv.pdf
	],
};

// Work experience, newest first.
// Edit content here, not in the markup. Anything marked TODO is a placeholder.

export interface Experience {
	company: string;
	companyUrl?: string;
	role: string;
	start: string;
	end: string;
	summary: string;
	highlights: string[];
	stack: string[];
}

export const experience: Experience[] = [
	{
		company: "Naranjo Intelligent Solutions",
		role: "Full-Stack Developer (Intern)",
		start: "2025-09", // e.g. "2026-01"
		end: "2026-07",
		summary: "Worked on AITANNA.AI across the frontend and backend.",
		highlights: [
			"Built features for the React frontend and the Node.js/Koa API backed by MongoDB.",
			"Worked in a monorepo with Docker-based environments.",
			"Followed a branch-based Git/GitHub workflow with conventional commits and code review.",
			// TODO: add 1–2 concrete achievements, ideally with numbers
		],
		stack: ["React", "Node.js", "Koa", "MongoDB", "Docker", "Git", "GitHub"],
	},
];

// Work experience, newest first.
// Edit content here, not in the markup. Anything marked TODO is a placeholder.

export interface Experience {
	company: string;
	companyUrl?: string;
	role: string;
	/** `"YYYY-MM"`. */
	start: string;
	/** `"YYYY-MM"`, or `"present"`. */
	end: string;
	summary: string;
	highlights: string[];
	stack: string[];
}

export const experience: Experience[] = [
	{
		company: "Naranjo",
		role: "Full-Stack Developer (Intern)",
		start: "TODO", // e.g. "2026-01"
		end: "TODO",
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

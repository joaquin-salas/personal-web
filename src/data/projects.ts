// Featured projects shown on the home page, in display order.
// Temporary: projects become a content collection (src/content/projects/) in the next step.

export interface Project {
	title: string;
	description: string;
	stack: string[];
	repo?: string;
	demo?: string;
}

export const projects: Project[] = [
	{
		title: "joaquinsalas.dev",
		description:
			"This website: a statically generated portfolio and blog, self-hosted on an Oracle Cloud instance behind a reverse proxy.",
		stack: ["Astro", "TypeScript"],
		// repo: "https://github.com/TODO/personal-web",
	},
];

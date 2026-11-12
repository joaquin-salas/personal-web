// Builds the site's filesystem (see src/lib/terminal/fs.ts for the shape and the path logic):
// `~` holds the CV documents and one folder each for projects and articles. Build time only.

import { getArticles, getArticleUrl } from "@/lib/articles";
import { getProjects, getProjectUrl } from "@/lib/projects";
import type { DirNode } from "@/lib/terminal/fs";

export async function getFilesystem(): Promise<DirNode> {
	const [projects, articles] = await Promise.all([getProjects(), getArticles()]);
	return {
		kind: "dir",
		name: "~",
		href: "/",
		children: [
			{
				kind: "dir",
				name: "projects",
				href: "/projects/",
				children: projects.map((project) => ({
					kind: "file",
					name: `${project.id}.md`,
					type: "project",
					href: getProjectUrl(project),
					title: project.data.title,
					description: project.data.description,
					date: project.data.pubDate.toISOString(),
					featured: project.data.featured,
				})),
			},
			{
				kind: "dir",
				name: "articles",
				href: "/articles/",
				children: articles.map((article) => ({
					kind: "file",
					name: `${article.id}.md`,
					type: "article",
					href: getArticleUrl(article),
					title: article.data.title,
					description: article.data.description,
					date: article.data.pubDate.toISOString(),
				})),
			},
			{ kind: "file", name: "about.md", type: "doc" },
			{ kind: "file", name: "experience.md", type: "doc" },
			{ kind: "file", name: "education.md", type: "doc" },
		],
	};
}

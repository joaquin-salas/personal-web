import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

export function getProjectUrl(project: Project): string {
	return `/projects/${project.id}/`;
}

/** Published projects (plus drafts in dev), newest first. */
export async function getProjects(): Promise<Project[]> {
	const projects = await getCollection(
		"projects",
		(project) => import.meta.env.DEV || !project.data.draft,
	);
	return projects.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Projects marked `featured: true`, for the home page. */
export async function getFeaturedProjects(): Promise<Project[]> {
	return (await getProjects()).filter((project) => project.data.featured);
}

import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

// Each post is a folder: src/content/blog/<slug>/index.md. The folder name is the entry id and
// the URL slug; images used by the post live in the same folder.

export function getPostUrl(post: BlogPost): string {
	return `/blog/${post.id}/`;
}

/** Published posts (plus drafts in dev), newest first. */
export async function getPosts(): Promise<BlogPost[]> {
	const posts = await getCollection("blog", (post) => import.meta.env.DEV || !post.data.draft);
	return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

import { getCollection, type CollectionEntry } from "astro:content";
import { locales, type Locale } from "@/i18n/locales";
import { isLocale, localizePath } from "@/i18n/utils";

export type BlogPost = CollectionEntry<"blog">;

// Each post is a folder: src/content/blog/<slug>/<locale>.md (e.g. my-post/en.md, my-post/es.md).
// The folder name is the URL slug; images used by the post live in the same folder.

export function getPostLocale(post: BlogPost): Locale {
	const locale = post.id.split("/").at(-1);
	if (!isLocale(locale)) {
		throw new Error(
			`Blog post "${post.id}" must be named after its language: ${locales.map((l) => `${l}.md`).join(", ")}`,
		);
	}
	return locale;
}

export function getPostSlug(post: BlogPost): string {
	return post.id.slice(0, post.id.lastIndexOf("/"));
}

export function getPostUrl(post: BlogPost): string {
	return localizePath(`/blog/${getPostSlug(post)}/`, getPostLocale(post));
}

/** Published posts in `locale` (plus drafts in dev), newest first. */
export async function getPosts(locale: Locale): Promise<BlogPost[]> {
	const posts = await getCollection(
		"blog",
		(post) => getPostLocale(post) === locale && (import.meta.env.DEV || !post.data.draft),
	);
	return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** URLs of this post in every locale it has been translated to (including its own). */
export async function getPostAlternates(post: BlogPost): Promise<Partial<Record<Locale, string>>> {
	const slug = getPostSlug(post);
	const alternates: Partial<Record<Locale, string>> = {};
	for (const locale of locales) {
		const translation = (await getPosts(locale)).find((p) => getPostSlug(p) === slug);
		if (translation) alternates[locale] = getPostUrl(translation);
	}
	return alternates;
}

/** `getStaticPaths` result for a locale's `blog/[...slug].astro`. */
export async function getPostStaticPaths(locale: Locale) {
	const posts = await getPosts(locale);
	return posts.map((post) => ({
		params: { slug: getPostSlug(post) },
		props: { post },
	}));
}

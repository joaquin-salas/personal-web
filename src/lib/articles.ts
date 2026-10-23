import { getCollection, type CollectionEntry } from "astro:content";

export type Article = CollectionEntry<"articles">;

export function getArticleUrl(article: Article): string {
	return `/articles/${article.id}/`;
}

/** Published articles (plus drafts in dev), newest first. */
export async function getArticles(): Promise<Article[]> {
	const articles = await getCollection(
		"articles",
		(article) => import.meta.env.DEV || !article.data.draft,
	);
	return articles.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Each entry is a folder: src/content/<collection>/<slug>/index.md. The folder name becomes the
// entry id and the URL slug; images used by the entry live in the same folder.
const entries = (collection: string) =>
	glob({ pattern: "*/index.{md,mdx}", base: `./src/content/${collection}` });

const articles = defineCollection({
	loader: entries("articles"),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			// Path relative to the Markdown file, e.g. `./cover.png`
			cover: z.object({ src: image(), alt: z.string() }).optional(),
			// Drafts are visible in `astro dev` but excluded from production builds
			draft: z.boolean().default(false),
		}),
});

const projects = defineCollection({
	loader: entries("projects"),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			stack: z.array(z.string()),
			repo: z.url().optional(),
			demo: z.url().optional(),
			// Shown on the home page
			featured: z.boolean().default(false),
			cover: z.object({ src: image(), alt: z.string() }).optional(),
			draft: z.boolean().default(false),
		}),
});

export const collections = { articles, projects };

import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
	// src/content/blog/<slug>/index.md — see src/lib/blog.ts
	loader: glob({ pattern: "*/index.{md,mdx}", base: "./src/content/blog" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			author: z.string().default("Joaquín Salas"),
			// Path relative to the post file, e.g. `./cover.png`
			cover: z
				.object({
					src: image(),
					alt: z.string(),
				})
				.optional(),
			tags: z.array(z.string()).default([]),
			// Drafts are visible in `astro dev` but excluded from production builds
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };

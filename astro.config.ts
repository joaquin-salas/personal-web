import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
	site: "https://joaquinsalas.dev",

	markdown: {
		// Light code blocks that sit on the page instead of dark slabs.
		shikiConfig: { theme: "github-light" },
	},

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [mdx()],
});

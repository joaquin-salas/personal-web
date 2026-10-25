import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
	site: "https://joaquinsalas.dev",

	markdown: {
		// Syntax colors come from the --astro-code-* tokens in global.css, so they follow the palette.
		shikiConfig: { theme: "css-variables" },
	},

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [mdx()],
});

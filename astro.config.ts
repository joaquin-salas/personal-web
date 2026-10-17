import { defineConfig } from "astro/config";
import { defaultLocale, locales } from "./src/i18n/locales";

// https://astro.build/config
export default defineConfig({
	site: "https://joaquinsalas.dev",
	i18n: {
		locales: [...locales],
		defaultLocale,
		routing: {
			prefixDefaultLocale: false,
		},
	},
});

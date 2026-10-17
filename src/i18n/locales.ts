export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

/** Served without a URL prefix (`/`); every other locale lives under `/<locale>/`. */
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
	en: "English",
	es: "Español",
};

/** BCP 47 tags used for date formatting. */
export const intlLocales: Record<Locale, string> = {
	en: "en-GB",
	es: "es-ES",
};

/** A value written once per locale, e.g. `{ en: "Hello", es: "Hola" }`. */
export type Translated<T = string> = Record<Locale, T>;

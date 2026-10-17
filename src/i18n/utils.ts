import { defaultLocale, intlLocales, locales, type Locale } from "./locales";

export function isLocale(value: string | undefined): value is Locale {
	return locales.includes(value as Locale);
}

/** Narrows `Astro.currentLocale` to a known locale. */
export function getLocale(currentLocale: string | undefined): Locale {
	return isLocale(currentLocale) ? currentLocale : defaultLocale;
}

/** `/blog/` → `/es/blog/` for Spanish, unchanged for the default locale. */
export function localizePath(path: string, locale: Locale): string {
	return locale === defaultLocale ? path : `/${locale}${path}`;
}

/** `/es/blog/` → `/blog/`. */
export function stripLocale(pathname: string): string {
	const [, first, ...rest] = pathname.split("/");
	if (first !== defaultLocale && isLocale(first)) {
		return `/${rest.join("/")}`;
	}
	return pathname;
}

/** The same page in every locale, used for the language picker and hreflang links. */
export function getAlternatePaths(pathname: string): Record<Locale, string> {
	const path = stripLocale(pathname);
	return Object.fromEntries(
		locales.map((locale) => [locale, localizePath(path, locale)]),
	) as Record<Locale, string>;
}

export function formatDate(date: Date, locale: Locale): string {
	return new Intl.DateTimeFormat(intlLocales[locale], {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
}

/** Formats `"2026-01"` as "Jan 2026" / "ene 2026". Other values (e.g. `"2022"`) are returned as-is. */
export function formatYearMonth(value: string, locale: Locale): string {
	const match = /^(\d{4})-(\d{2})$/.exec(value);
	if (!match) return value;
	const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1));
	return new Intl.DateTimeFormat(intlLocales[locale], {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
}

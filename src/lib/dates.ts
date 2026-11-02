// All dates on the site are formatted here so they look the same everywhere.
// Content dates are parsed as UTC midnight, so format in UTC to avoid showing the previous day.

/** e.g. "1 July 2022". */
export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
}

/** e.g. "Oct 30, 2026". */
export function formatMonthDayYear(date: Date): string {
	// en-US because en-GB always puts the day first.
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
}

/** e.g. `formatPeriod("2025-09", "present")` → "Sept 2025 – Present". */
export function formatPeriod(start: string, end: string): string {
	return `${formatYearMonth(start)} – ${end === "present" ? "Present" : formatYearMonth(end)}`;
}

/** e.g. "Oct 2026". */
export function formatMonthYear(date: Date): string {
	return new Intl.DateTimeFormat("en-GB", {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
}

/** Formats `"2026-01"` as "Jan 2026". Other values (e.g. `"2022"`) are returned as-is. */
export function formatYearMonth(value: string): string {
	const match = /^(\d{4})-(\d{2})$/.exec(value);
	if (!match) return value;
	return formatMonthYear(new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1)));
}

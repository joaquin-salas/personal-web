// All dates on the site are formatted here so they look the same everywhere.
// Content dates are parsed as UTC midnight, so format in UTC to avoid showing the previous day.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** e.g. "1 July 2022". */
export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
}

/** e.g. "01 Jul 2022": always 11 characters, so dates line up in `ls -l` columns. */
export function formatShortDate(date: Date): string {
	const day = String(date.getUTCDate()).padStart(2, "0");
	return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** e.g. `formatPeriod("2025-09", "present")` → "Sep 2025 – Present". */
export function formatPeriod(start: string, end: string): string {
	return `${formatYearMonth(start)} – ${end === "present" ? "Present" : formatYearMonth(end)}`;
}

/** Formats `"2026-01"` as "Jan 2026". Other values (e.g. `"2022"`) are returned as-is. */
export function formatYearMonth(value: string): string {
	const match = /^(\d{4})-(\d{2})$/.exec(value);
	if (!match) return value;
	return `${MONTHS[Number(match[2]) - 1]} ${match[1]}`;
}

// All dates on the site are formatted here so they look the same everywhere.

/** e.g. "1 July 2022". */
export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
}

/** e.g. `formatPeriod("2025-09", "present")` → "Sept 2025 — Present". */
export function formatPeriod(start: string, end: string): string {
	return `${formatYearMonth(start)} — ${end === "present" ? "Present" : formatYearMonth(end)}`;
}

/** Formats `"2026-01"` as "Jan 2026". Other values (e.g. `"2022"`) are returned as-is. */
export function formatYearMonth(value: string): string {
	const match = /^(\d{4})-(\d{2})$/.exec(value);
	if (!match) return value;
	const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1));
	return new Intl.DateTimeFormat("en-GB", {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
}

// Degrees and courses, newest first.
// Edit content here, not in the markup. Anything marked TODO is a placeholder.

export interface Education {
	degree: string;
	institution: string;
	location: string;
	/** `"YYYY"` or `"YYYY-MM"`. */
	start: string;
	end: string;
	details?: string;
}

export const education: Education[] = [
	{
		degree: "BSc in Computer Engineering",
		institution: "University of Granada (UGR)",
		location: "Granada, Spain",
		start: "TODO",
		end: "TODO",
		// details: "Final-year project: TODO",
	},
];

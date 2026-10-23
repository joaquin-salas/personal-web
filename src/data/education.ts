// Degrees and courses, newest first.
// Edit content here, not in the markup. Anything marked TODO is a placeholder.

export interface Education {
	degree: string;
	institution: string;
	location: string;
	start: string;
	end: string;
	details?: string;
}

export const education: Education[] = [
	{
		degree: "BSc in Computer Engineering",
		institution: "University of Granada (UGR)",
		location: "Granada, Spain",
		start: "2021",
		end: "2026",
		details: "Final-year project: Gateway between EPICS and OPC UA",
	},
];

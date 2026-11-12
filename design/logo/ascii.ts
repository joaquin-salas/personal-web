// Prints the JS monogram as block-character art, for the `neofetch` output on the home page
// (src/components/Neofetch.astro). It fills the mark's strokes from mark.mjs and samples them on
// a grid of half blocks, so one character is two square "pixels".
// Usage: node design/logo/ascii.ts [columns=26] [threshold=0.4]
import { markShapes } from "./mark.mjs";

type Point = [number, number];

/** The stroke outlines as polygons. Arcs (round caps) are approximated by their end points. */
function polygons(): Point[][] {
	return markShapes("regular").strokes.map((d: string) => {
		const tokens = d.match(/[MLAZ]|-?\d*\.?\d+/g) ?? [];
		const points: Point[] = [];
		let i = 0;
		while (i < tokens.length) {
			const command = tokens[i++];
			if (command === "M" || command === "L") {
				while (i < tokens.length && !/[A-Z]/.test(tokens[i])) {
					points.push([Number(tokens[i++]), Number(tokens[i++])]);
				}
			} else if (command === "A") {
				i += 5; // rx ry rotation large-arc sweep
				points.push([Number(tokens[i++]), Number(tokens[i++])]);
			}
		}
		return points;
	});
}

const shapes = polygons();
const inside = (x: number, y: number): boolean =>
	shapes.some((polygon) => {
		let hit = false;
		for (let a = 0, b = polygon.length - 1; a < polygon.length; b = a++) {
			const [xa, ya] = polygon[a];
			const [xb, yb] = polygon[b];
			if (ya > y !== yb > y && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) hit = !hit;
		}
		return hit;
	});

const [left, right, top, bottom] = [15, 78, 14, 84]; // the mark's bounds in its 100×100 viewBox
const columns = Number(process.argv[2] ?? 26);
const threshold = Number(process.argv[3] ?? 0.4);
const size = (right - left) / columns;
const rows = Math.ceil((bottom - top) / size);
const SAMPLES = 4; // per pixel side

const pixels = Array.from({ length: rows }, (_, row) =>
	Array.from({ length: columns }, (_, column) => {
		let filled = 0;
		for (let a = 0; a < SAMPLES; a++) {
			for (let b = 0; b < SAMPLES; b++) {
				const x = left + (column + (a + 0.5) / SAMPLES) * size;
				const y = top + (row + (b + 0.5) / SAMPLES) * size;
				if (inside(x, y)) filled++;
			}
		}
		return filled / SAMPLES ** 2 > threshold;
	}),
);

const lines: string[] = [];
for (let row = 0; row < rows; row += 2) {
	const line = pixels[row].map((upper, column) => {
		const lower = pixels[row + 1]?.[column] ?? false;
		return upper && lower ? "█" : upper ? "▀" : lower ? "▄" : " ";
	});
	lines.push(line.join("").trimEnd());
}
console.log(lines.filter((line) => line.length > 0).join("\n"));

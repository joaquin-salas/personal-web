// The site as a filesystem, as plain data: folders and files with what they link to. Shared by
// the build (pages and output templates) and the browser (the prompt's cd, cat and completion),
// so this module must not import anything from Astro.

/** What a file is: a CV document printed in the terminal, or an article or project page. */
export type FileType = "doc" | "article" | "project";

export interface FileNode {
	kind: "file";
	name: string;
	type: FileType;
	/** The page an article or project opens. CV documents have no page of their own. */
	href?: string;
	title?: string;
	description?: string;
	/** ISO date. */
	date?: string;
	featured?: boolean;
}

export interface DirNode {
	kind: "dir";
	name: string;
	href: string;
	children: FsNode[];
}

export type FsNode = FileNode | DirNode;

/** A resolved path: the node and its folder names from `~`. */
export interface Resolved {
	node: FsNode;
	parts: string[];
}

export const HOME = "/home/joaquin";

/** `[]` → "~", `["projects"]` → "~/projects". */
export function displayPath(parts: string[]): string {
	return parts.length ? `~/${parts.join("/")}` : "~";
}

/** The node at `parts` under `root`, or null. */
export function nodeAt(root: DirNode, parts: string[]): FsNode | null {
	let node: FsNode = root;
	for (const part of parts) {
		if (node.kind !== "dir") return null;
		const child: FsNode | undefined = node.children.find((c) => c.name === part);
		if (!child) return null;
		node = child;
	}
	return node;
}

/**
 * Resolves a path typed at the prompt, relative to `cwd`: "~", "~/x", "/home/joaquin/x", ".",
 * ".." and trailing slashes work. Going above `~` stays at `~`.
 */
export function resolve(root: DirNode, cwd: string[], path?: string): Resolved | null {
	let parts: string[];
	let rest = path ?? "";
	if (rest === "~" || rest.startsWith("~/")) {
		parts = [];
		rest = rest.slice(1);
	} else if (rest === HOME || rest.startsWith(`${HOME}/`)) {
		parts = [];
		rest = rest.slice(HOME.length);
	} else if (rest.startsWith("/")) {
		return null;
	} else {
		parts = [...cwd];
	}
	for (const segment of rest.split("/")) {
		if (!segment || segment === ".") continue;
		if (segment === "..") parts.pop();
		else parts.push(segment);
	}
	const node = nodeAt(root, parts);
	return node ? { node, parts } : null;
}

/** The command that clicking a node runs: folders are listed, CV files read, pages opened. */
export function commandFor(node: FsNode, path: string): string {
	if (node.kind === "dir") return `cd ${path} && ls`;
	return node.type === "doc" ? `cat ${path}` : `open ${path}`;
}

/** One line of `tree` output: the box-drawing prefix (e.g. "│   ├── "), the node and its path. */
export interface TreeLine {
	prefix: string;
	node: FsNode;
	path: string;
}

/** `tree` lines for a folder's contents; `base` is the folder's path ("~/projects"). */
export function treeLines(dir: DirNode, base: string, indent = ""): TreeLine[] {
	return dir.children.flatMap((node, i) => {
		const last = i === dir.children.length - 1;
		const path = `${base}/${node.name}`;
		const line = { prefix: `${indent}${last ? "└── " : "├── "}`, node, path };
		const nested =
			node.kind === "dir" ? treeLines(node, path, `${indent}${last ? "    " : "│   "}`) : [];
		return [line, ...nested];
	});
}

/** The summary `tree` prints last, e.g. "2 directories, 10 files". */
export function treeSummary(dir: DirNode): string {
	const lines = treeLines(dir, "");
	const dirs = lines.filter((line) => line.node.kind === "dir").length;
	const files = lines.length - dirs;
	return `${dirs} ${dirs === 1 ? "directory" : "directories"}, ${files} ${files === 1 ? "file" : "files"}`;
}

/** Every folder, `~` first, with its path parts. */
export function allDirs(root: DirNode, parts: string[] = []): { dir: DirNode; parts: string[] }[] {
	return [
		{ dir: root, parts },
		...root.children.flatMap((node) =>
			node.kind === "dir" ? allDirs(node, [...parts, node.name]) : [],
		),
	];
}

/** Every CV document, with its path parts. */
export function allDocs(
	root: DirNode,
	parts: string[] = [],
): { file: FileNode; parts: string[] }[] {
	return root.children.flatMap((node) => {
		if (node.kind === "dir") return allDocs(node, [...parts, node.name]);
		return node.type === "doc" ? [{ file: node, parts: [...parts, node.name] }] : [];
	});
}

/** Tab completion for a path being typed: the matching names, with "/" after folders. */
export function completePath(root: DirNode, cwd: string[], word: string): string[] {
	const slash = word.lastIndexOf("/");
	const folder = slash >= 0 ? word.slice(0, slash + 1) : "";
	const found = resolve(root, cwd, folder);
	if (!found || found.node.kind !== "dir") return [];
	const start = word.slice(slash + 1);
	return found.node.children
		.filter((child) => child.name.startsWith(start))
		.map((child) => folder + child.name + (child.kind === "dir" ? "/" : ""));
}

/** The longest prefix all the strings share. */
export function commonPrefix(values: string[]): string {
	if (!values.length) return "";
	return values.reduce((a, b) => {
		let i = 0;
		while (i < a.length && a[i] === b[i]) i++;
		return a.slice(0, i);
	});
}

import { execSync } from "node:child_process";

// Evaluated once per build, so every page shows the same stamp.

export const buildDate = new Date();

/** Short hash of the commit being built, or `undefined` outside a git checkout. */
export const buildCommit: string | undefined = (() => {
	try {
		return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
			.toString()
			.trim();
	} catch {
		return undefined;
	}
})();

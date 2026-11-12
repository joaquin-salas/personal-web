// The commands the prompt understands. `help` lists the documented ones; the others are easter
// eggs. Shared by the build (the `help` output) and the browser (running and completing them).

export interface CommandInfo {
	name: string;
	/** Arguments, shown in `help`, e.g. "<file>". */
	usage?: string;
	description: string;
}

export const COMMANDS: CommandInfo[] = [
	{ name: "help", description: "Show this list" },
	{ name: "neofetch", description: "Show the summary again" },
	{ name: "ls", usage: "[path]", description: "List a folder, with dates and descriptions" },
	{ name: "tree", usage: "[path]", description: "Show every folder and file" },
	{ name: "cd", usage: "<folder>", description: "Change folder (cd .. goes up, cd - goes back)" },
	{ name: "pwd", description: "Show the current folder" },
	{ name: "cat", usage: "<file>", description: "Read a file, or open an article or project" },
	{
		name: "open",
		usage: "<target>",
		description: "Open an article or project, or github, linkedin or email",
	},
	{ name: "whoami", description: "Who runs this machine" },
	{ name: "clear", description: "Clear the screen (Ctrl+L)" },
	{ name: "history", description: "Commands typed this session" },
	{ name: "echo", usage: "<text>", description: "Print the text" },
];

export const EASTER_EGGS = [
	"sudo",
	"rm",
	"vim",
	"nano",
	"theme",
	"pacman",
	"exit",
	"reboot",
	"shutdown",
];

export const COMMAND_NAMES = [...COMMANDS.map((command) => command.name), ...EASTER_EGGS];

/** Splits a command line into commands (joined by `&&`) and each into its words. */
export function parseLine(line: string): string[][] {
	return line
		.split("&&")
		.map((part) => part.trim().split(/\s+/).filter(Boolean))
		.filter((words) => words.length > 0);
}

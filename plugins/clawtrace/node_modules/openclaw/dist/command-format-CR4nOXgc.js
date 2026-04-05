import { n as normalizeProfileName } from "./profile-utils-C7uzTwgJ.js";
import path from "node:path";
//#region src/cli/cli-name.ts
const DEFAULT_CLI_NAME = "openclaw";
const KNOWN_CLI_NAMES = new Set([DEFAULT_CLI_NAME]);
const CLI_PREFIX_RE$1 = /^(?:((?:pnpm|npm|bunx|npx)\s+))?(openclaw)\b/;
function resolveCliName(argv = process.argv) {
	const argv1 = argv[1];
	if (!argv1) return DEFAULT_CLI_NAME;
	const base = path.basename(argv1).trim();
	if (KNOWN_CLI_NAMES.has(base)) return base;
	return DEFAULT_CLI_NAME;
}
function replaceCliName(command, cliName = resolveCliName()) {
	if (!command.trim()) return command;
	if (!CLI_PREFIX_RE$1.test(command)) return command;
	return command.replace(CLI_PREFIX_RE$1, (_match, runner) => {
		return `${runner ?? ""}${cliName}`;
	});
}
//#endregion
//#region src/cli/command-format.ts
const CLI_PREFIX_RE = /^(?:pnpm|npm|bunx|npx)\s+openclaw\b|^openclaw\b/;
const CONTAINER_FLAG_RE = /(?:^|\s)--container(?:\s|=|$)/;
const PROFILE_FLAG_RE = /(?:^|\s)--profile(?:\s|=|$)/;
const DEV_FLAG_RE = /(?:^|\s)--dev(?:\s|$)/;
const UPDATE_COMMAND_RE = /^(?:pnpm|npm|bunx|npx)\s+openclaw\b.*(?:^|\s)update(?:\s|$)|^openclaw\b.*(?:^|\s)update(?:\s|$)/;
function formatCliCommand(command, env = process.env) {
	const normalizedCommand = replaceCliName(command, resolveCliName());
	const container = env.OPENCLAW_CONTAINER_HINT?.trim();
	const profile = normalizeProfileName(env.OPENCLAW_PROFILE);
	if (!container && !profile) return normalizedCommand;
	if (!CLI_PREFIX_RE.test(normalizedCommand)) return normalizedCommand;
	const additions = [];
	if (container && !CONTAINER_FLAG_RE.test(normalizedCommand) && !UPDATE_COMMAND_RE.test(normalizedCommand)) additions.push(`--container ${container}`);
	if (!container && profile && !PROFILE_FLAG_RE.test(normalizedCommand) && !DEV_FLAG_RE.test(normalizedCommand)) additions.push(`--profile ${profile}`);
	if (additions.length === 0) return normalizedCommand;
	return normalizedCommand.replace(CLI_PREFIX_RE, (match) => `${match} ${additions.join(" ")}`);
}
//#endregion
export { replaceCliName as n, resolveCliName as r, formatCliCommand as t };

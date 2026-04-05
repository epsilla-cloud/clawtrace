import { n as CLI_RESUME_WATCHDOG_DEFAULTS, t as CLI_FRESH_WATCHDOG_DEFAULTS } from "./cli-watchdog-defaults-ay_R4q8w.js";
//#region extensions/openai/cli-backend.ts
function buildOpenAICodexCliBackend() {
	return {
		id: "codex-cli",
		config: {
			command: "codex",
			args: [
				"exec",
				"--json",
				"--color",
				"never",
				"--sandbox",
				"workspace-write",
				"--skip-git-repo-check"
			],
			resumeArgs: [
				"exec",
				"resume",
				"{sessionId}",
				"--color",
				"never",
				"--sandbox",
				"workspace-write",
				"--skip-git-repo-check"
			],
			output: "jsonl",
			resumeOutput: "text",
			input: "arg",
			modelArg: "--model",
			sessionIdFields: ["thread_id"],
			sessionMode: "existing",
			imageArg: "--image",
			imageMode: "repeat",
			reliability: { watchdog: {
				fresh: { ...CLI_FRESH_WATCHDOG_DEFAULTS },
				resume: { ...CLI_RESUME_WATCHDOG_DEFAULTS }
			} },
			serialize: true
		}
	};
}
//#endregion
export { buildOpenAICodexCliBackend as t };
